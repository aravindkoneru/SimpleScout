import pygal
import json

from pygal.style import DarkSolarizedStyle
from pprint import pprint

with open('../../collectedJSON/team_11/dataPoints.json') as data_file:
    data = json.load(data_file)


def allZero(someArray):
    for num in someArray:
        if(num != 0):
            return False
    return True


line_chart = pygal.Line(style=DarkSolarizedStyle)

line_chart.title = 'Team 11 Quantatative Stats'  #@TODO: Should auto to team
line_chart.x_labels = map(str, range(1, 13))
line_chart.x_title = "Match Number"
line_chart.y_title = "Interactions with Respective Object"

line_chart.show_y_labels = True
line_chart.show_dots = True

max = -100000000
for item in data:
    if(type(data[item][0]) is int and allZero(data[item]) == False):
        for num in data[item]:
            if(num > max):
                max = num
        line_chart.add(item, data[item])

line_chart.y_labels = map(str, range(1, max+1))
line_chart.render_to_file('lineChart.svg')


bar_chart = pygal.Bar(style=DarkSolarizedStyle)
bar_chart.title = 'Qualitative Data for team 11' #@TODO: Should auto to team
barCompleted = []
barFailed = []
barNames = []

for item in data:
    if(type(data[item][0]) is not int):
        barNames.append(item)
        completed = 0
        failed = 0
        for boolVal in data[item]:
            if boolVal is True:
                completed += 1
            else:
                failed += 1
        barCompleted.append(completed)
        barFailed.append(failed)

bar_chart.add('Successful', barCompleted)
bar_chart.add('Failed', barFailed)
bar_chart.x_labels = barNames

bar_chart.render_to_file('barChart.svg')
