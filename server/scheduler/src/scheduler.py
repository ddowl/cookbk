
'''
Creates an optimal schedule for the given recipes ending at 'serving_time'
Output format:

...

'''
def schedule_recipes(recipes, serving_time):
    pass


'''
Since we're figuring out how to do formulate optimization problems, we'll make a lot of assumptions.
Let's assume that there's only 1 cook, and no constraint on kitchenware (i.e. infinite ovens, bowls, etc)
For now we can represent recipes by a list arrays where each subarray has a duration and attending status"

[
    [3, True],
    [10, False],
    ...
]

We can turn our recipe scheduling problem into the job-shop problem by making a certain machine represent the one cook,
namely machine '0'. All attended recipe steps will be required to 'be processed by' machine 0, which represents the
cook constraint. We can tell the constraint solver to run non-attending tasks in parallel by assigning them to unique
machines.

The structure of the input we need to transform to is described as 

jobs_data = [  # task = (machine_id, processing_time).
    [(0, 3), (1, 2), (2, 2)],  # Job0
    [(0, 2), (2, 1), (1, 4)],  # Job1
    [(1, 4), (2, 3)]  # Job2
]

in https://developers.google.com/optimization/scheduling/job_shop

NOTE: Optimizer currently doesn't include penalty for not having recipes finish close together
'''
def optimize_recipes(recipes):
    import collections

    # Import Python wrapper for or-tools CP-SAT solver.
    from ortools.sat.python import cp_model

    print(recipes)

    if len(recipes) == 0:
        return []

    """Minimal jobshop problem."""
    # Create the model.
    model = cp_model.CpModel()

    nonattending_machine = 1  # machine 0 is for attended tasks

    def task_transform(duration, attending):
        if attending:
            return (0, duration)
        else:
            nonlocal nonattending_machine
            task = (nonattending_machine, duration)
            nonattending_machine += 1
            return task

    jobs_data = [[task_transform(dur, attending) for dur, attending in recipe] for recipe in recipes]
    print(jobs_data)

    machines_count = 1 + max(task[0] for job in jobs_data for task in job)
    all_machines = range(machines_count)
    jobs_count = len(jobs_data)
    all_jobs = range(jobs_count)

    # Compute horizon. (i.e. global upper bound, if all tasks were processed serially)
    horizon = sum(task[1] for job in jobs_data for task in job)

    task_type = collections.namedtuple('task_type', 'start end interval')
    assigned_task_type = collections.namedtuple('assigned_task_type', 'start recipe step')

    # Create jobs.
    all_tasks = {}
    for job in all_jobs:
        for task_id, task in enumerate(jobs_data[job]):
            start_var = model.NewIntVar(0, horizon, 'start_%i_%i' % (job, task_id))
            duration = task[1]
            end_var = model.NewIntVar(0, horizon, 'end_%i_%i' % (job, task_id))
            interval_var = model.NewIntervalVar(start_var, duration, end_var, 'interval_%i_%i' % (job, task_id))
            all_tasks[job, task_id] = task_type(start=start_var, end=end_var, interval=interval_var)

    print(all_tasks)

    # Create and add disjunctive constraints.
    for machine in all_machines:
        intervals = []
        for job in all_jobs:
            for task_id, task in enumerate(jobs_data[job]):
                if task[0] == machine:
                    intervals.append(all_tasks[job, task_id].interval)
        model.AddNoOverlap(intervals)

    # Add precedence contraints.
    for job in all_jobs:
        for task_id in range(0, len(jobs_data[job]) - 1):
            model.Add(all_tasks[job, task_id].end <= all_tasks[job, task_id + 1].start)

    # Define objective function

    def last_task(job_idx):
        return all_tasks[(job_idx, len(jobs_data[job_idx]) - 1)]

    # # Minimize difference in recipe end times
    # # (The difference between the end times of the last steps between any 2 recipes should be minimized)
    # recipe_end_diff_var = model.NewIntVar(0, horizon, 'recipe_end_diff')
    #
    # def job_end_diff(job_a, job_b):
    #     last_task_a = last_task(job_a)
    #     last_task_b = last_task(job_b)
    #
    #     return last_task_a.end - last_task_b.end
    #
    # diffs = []
    # for job_a in all_jobs:
    #     for job_b in all_jobs:
    #         if job_a != job_b:
    #             diffs.append(job_end_diff(job_a, job_b))
    #
    # print(diffs)
    #
    # # recipe_end_diff_var is set to the maximum difference between job endings
    # # API doesn't support assigning this var to the difference of two IntVars
    # # "TypeError: NotSupported: model.GetOrMakeIndex((end_0_0 + -end_1_0))"
    # model.AddMaxEquality(recipe_end_diff_var, diffs)

    # Makespan objective.
    makespan_var = model.NewIntVar(0, horizon, 'makespan')
    model.AddMaxEquality(
        makespan_var,
        [last_task(job).end for job in all_jobs]
    )

    model.Minimize(makespan_var)

    # Solve model
    # Use solver.SolveWithSolutionCallback to examine intermediate solutions
    class RecipeSolutionPrinter(cp_model.CpSolverSolutionCallback):
        """Print intermediate solutions."""

        def __init__(self, tasks):
            cp_model.CpSolverSolutionCallback.__init__(self)
            self.__tasks = tasks
            self.__solution_count = 0

        def on_solution_callback(self):
            print('Solution %i' % self.__solution_count)
            print('  objective value = %i' % self.ObjectiveValue())
            print('  makespan_var = %i' % self.Value('makespan'))
            for t in self.__tasks:
                print('  %s = %i' % (t.start, self.Value(t.start)), end=' ')
                print('  %s = %i' % (t.end, self.Value(t.end)), end=' ')
                print()
            print()
            self.__solution_count += 1

        def solution_count(self):
            return self.__solution_count

    solver = cp_model.CpSolver()
    # printer = RecipeSolutionPrinter(all_tasks.values())
    # status = solver.SolveWithSolutionCallback(model, printer)
    status = solver.Solve(model)
    print(status)

    if status == cp_model.OPTIMAL:
        print("Found optimal solution!")

        # Print out makespan.
        print('Optimal Schedule Length: %i' % solver.ObjectiveValue())
        print()


        # Create one list of assigned tasks per machine.
        assigned_jobs = [[] for _ in all_machines]
        for job in all_jobs:
            for task_id, task in enumerate(jobs_data[job]):
                machine = task[0]
                assigned_jobs[machine].append(
                    assigned_task_type(
                        start=solver.Value(all_tasks[job, task_id].start),
                        recipe=job,
                        step=task_id))
        print(assigned_jobs)

        for machine in all_machines:
            # Sort by starting time.
            assigned_jobs[machine].sort()
            print(f"Machine {machine}")
            print(assigned_jobs[machine])

        return assigned_jobs

    elif status == cp_model.FEASIBLE:
        print("Found a feasible solution")
    elif status == cp_model.INFEASIBLE:
        raise Exception(f"Problem found to be infeasible {status}")
    elif status == cp_model.MODEL_INVALID:
        raise Exception(f"Model is invalid {status}")
    else:
        raise Exception("Unknown error")



