import sys
from Naked.toolshed.shell import execute_js, muterun_js, run_js

response = muterun_js('./testscript.js', '11')

if(response.exitcode == 0):
	print 'worked'
	print response.stdout
else:
	print 'didnt work'

