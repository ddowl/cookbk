
'''
Creates an optimal schedule for the given recipes ending at 'serving_time'
Output format:

...

'''
def schedule_recipes(recipes, serving_time):
    pass

import collections

# Import Python wrapper for or-tools CP-SAT solver.
from ortools.sat.python import cp_model

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
'''
def optimize_recipes(recipes):
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



    # Makespan objective.
    makespan_var = model.NewIntVar(0, horizon, 'makespan')
    model.AddMaxEquality(
        makespan_var,
        [all_tasks[(job, len(jobs_data[job]) - 1)].end for job in all_jobs])
    model.Minimize(makespan_var)

    # Minimize difference in recipe end times
    # (The difference between the end times of the last steps between any 2 recipes should be minimized)
    recipe_end_diff_var = model.NewIntVar(0, horizon, 'recipe_end_diff')

    def job_end_diff(job_a, job_b):
        last_idx_a = len(jobs_data[job_a]) - 1
        last_idx_b = len(jobs_data[job_a]) - 1
        end_of_last_step_a = all_tasks[(job_a, last_idx_a)].end
        end_of_last_step_b = all_tasks[(job_b, last_idx_b)].end

        interval_a_b = model.NewIntervalVar(end_of_last_step_a, duration, end_of_last_step_b, 'end_diff_interval_%i_%i_%i_%i' % (job_a, last_idx_a, job_b, last_idx_b))
        # interval_b_a = model.NewIntervalVar(end_of_last_step_b, duration, end_of_last_step_a, 'end_diff_interval_%i_%i_%i_%i' % (job_b, last_idx_b, job_a, last_idx_a))
        print(interval_a_b)
        # print(interval_b_a)

        return interval_a_b

    diffs = []
    for job_a in all_jobs:
        for job_b in all_jobs:
            # if job_a != job_b:
            diffs.append(job_end_diff(job_a, job_b))

    print(diffs)

    # recipe_end_diff_var is set to the maximum difference between job endings
    model.AddMaxEquality(recipe_end_diff_var, diffs)
    model.Minimize(recipe_end_diff_var)

    # Solve model.
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL:
        print("Found optimal solution!")

        # Print out makespan.
        print('Optimal Schedule Length: %i' % solver.ObjectiveValue())
        print(f"minimized recipe_end_diff: {solver.Value('recipe_end_diff')}")
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

    else:
        raise Exception(f"model was invalid or problem was infeasible {status}")

