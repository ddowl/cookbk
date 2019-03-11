class Step:
    def __init__(self, duration, attending, description):
        self.duration = duration
        self.attending = attending
        self.description = description


class Recipe:
    def __init__(self, name, max_serving_wait_time):
        self.name = name
        self.max_serving_wait_time = max_serving_wait_time
        self.steps = []
