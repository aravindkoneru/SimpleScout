import plotly.plotly as py
from plotly.graph_objs import *

#def drawGraph(graphingData)

trace0 = Scatter(
x = [1,2,3],
y = [10, 15, 13]
)

data = Data([trace0]);

layout = Layout(
    title = 'sample',
    xaxis = XAxis(
        title = 'x Axis'
    ),
    yaxis = YAxis(
        title = 'Y Axis'
    )
)

py.image.save_as({'data': data, 'layout': layout}, 'test.png');
