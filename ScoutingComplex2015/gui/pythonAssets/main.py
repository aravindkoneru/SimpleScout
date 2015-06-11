#JS and Python integration imports
from Naked.toolshed.shell import muterun_js
#Tkinter imports
from Tkinter import * #ignore error for more imports
import tkSimpleDialog

#create the splash screen with info
def splashScreen():
  #make the splash Tk object
  splash = Tk()
  splash.title('Si.Sc')
  splash.overrideredirect(False)
  splash.resizable(0,0)


  #make and pack canvas
  splashCanvas = Canvas(splash, height=500, width=500, bg="#212121", highlightthickness=0)
  splashCanvas.pack()

  #Create logo 
  logoImage = PhotoImage(file="../imageAssets/logo.gif")
  imageLabel = Label(splash, image = logoImage, bg = "#212121")
  imageLabel.place(relx = .5, rely = .3, anchor =CENTER)

  #Create the splash label with the text
  labelText = """Welcome to Si.Sc.
  Please use this program responsibily and follow all rules at competition.
  Feel free to cntribute to the project."""
  splashLabel =   Label(splash, text = labelText, bg = "#212121", fg = "white", justify = "center")
  splashLabel.place(relx=0.5, rely=0.6, anchor=CENTER)

  #Create continue button
  closeButton = Button(splash, text = "Continue", width = 10, command = splash.destroy)
  closeButton.place(relx = 0.5, rely = 0.8, anchor = CENTER)

  #call the splash screen and run it
  splash.mainloop()

#button call to generate the excel file
#@TODO: Work from here
def generateExcelFile():
  eventCode = tkSimpleDialog.askstring(title = "Event Code Entry", prompt = "Enter event code:")
  response = muterun_js('../jsAssets/write-excel.js', eventCode)

  if(response.exitcode == 0):
    print 'worked'
    print response.stdout
  else:
    print 'didnt work'

  #submitButton = Button(master, text="Generate For Event", width=10, command=getValue)
  #submitButton.pack()


#main run method that will run the entire application
def run():
  #Run the splash screen
  splashScreen()

  #Create the global variables for canvas and root
  global canvas
  global root

  #initial root to be a tk object
  root = Tk()
  root.title('Si.Sc')
  root.resizable(0,0)


  #Canvas
  canvas = Canvas(root, height=500, width=500, bg="#212121", highlightthickness=0)
  canvas.pack();

  #put image again
  logoImage = PhotoImage(file="../imageAssets/logo.gif")
  imageLabel = Label(root, image = logoImage, bg = "#212121")
  imageLabel.place(relx = .5, rely = .2, anchor =CENTER)


  #Figure out to set the image icon in the dock
  """
  img = PhotoImage(file='../imageAssets/logo.gif')
  root.tk.call('wm', 'iconphoto', root._w, img)
  """

  #Add button to generate excel
  generateExcelButton = Button(root, text = "Generate Excel", relief = 'flat', command = generateExcelFile, bg = "#212121", fg = "#E100D4")
  generateExcelButton.place(relx = .39, rely = .5)


  #Run the main windows
  root.mainloop()

#calls the run function and causes the gui to activate
run();