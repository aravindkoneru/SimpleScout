import pygal
import json

from pygal.style import NeonStyle
from pprint import pprint


def allZero(someArray):
    for num in someArray:
        if(num != 0):
            return False
    return True



def makeGraphs(teamNumber):
    with open('../../collectedJSON/team_' + str(teamNumber) + '/dataPoints.json') as data_file:
        data = json.load(data_file)

    line_chart = pygal.Line(style=NeonStyle)

    line_chart.title = 'Team ' + str(teamNumber) + ' Quantatative Stats'
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

    fileName = 'team' + str(teamNumber) + 'Quant.svg'
    line_chart.render_to_file(fileName)

    """This is the start of the qualitative graph data"""

    bar_chart = pygal.Bar(style=NeonStyle)

    bar_chart.title = 'Team ' + str(teamNumber) + ' Qualitative Stats'
    bar_chart.y_title = "Times Action wwas Performed"
    bar_chart.x_title = "Event Name"

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

    fileName = 'team' + str(teamNumber) + 'Qual.svg'
    bar_chart.render_to_file(fileName)

makeGraphs(11);
