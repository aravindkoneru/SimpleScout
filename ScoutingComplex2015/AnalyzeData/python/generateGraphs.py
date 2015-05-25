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

#jsonData = json.load(data);
#
#print jsonData;

line_chart = pygal.Line(style=DarkSolarizedStyle)

line_chart.title = 'Team 11 Quantatative Stats'
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

line_chart.y_labels = map(str, range(1,max+1))
#line_chart.add('totes', data['totes']);
line_chart.render_to_file('lineChart.svg')

#
#bar_chart = pygal.Bar()
#bar_chart.title = 'Team 11 Qualitative Stats'
#line_chart.y.title = "Number of times Attempted/Completed"
#chart.x_labels = 'robotSet', 'containerSet', 'toteSet', 'stackedToteSet', 'obtained', 'step'
