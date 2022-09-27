Feature: Minesweeper

Explain that by using the URL parameter "mockup" a text box appears.

Explain that the user can input a custom mock up layout in the box in the following styles.

Explain that by using the URL parameter "layout" a mock up layout can also be used.

Explain that each line will contain 'x' meaning a bomb, or 'o' meaning a lack of bomb.

Explain that input lines can either be separated by '-' or be written in different lines.

Explain that each cell will be referred as 'x-y' where 'x' is row number and 'y' column number.

Explain that to represent the output the following symbols will be used:
    '·' to represent an hidden cell
    'x' to represent a visible bomb
    the numbers from '0' to '8' to represent a visible cell without a bomb
    '!' to represent a hidden cell with the flag tag
    '?' to represent a hidden cell with the question tag

Scenario: Revealing a bomb: game over
Given the user loads the custom layout 'xo'
When the user reveals the cell '1-1'
Then the user has lost the game

Scenario: Revealing all free cells: victory
Given the user loads the custom layout 'xo'
When the user reveals the cell '1-2'
Then the user has won the game

Scenario: Winning by default
Given the user loads the custom layout 'x'
Then the user has won the game

Scenario: Revealing a cell with a bomb
Given the user loads the custom layout
"""
xo
oo
"""
When the user reveals the cell "1-1"
Then the display shows the layout
"""
x·
··
"""

Scenario Outline: Revealing a cell without a bomb: showing neighbour bomb count
Given the user loads the custom layout "<layoutInput>"
When the user reveals the cell "<cell>"
Then the display shows the layout "<layoutOutput>"

Examples:
| layoutInput | cell | layoutOutput |
| xoo-ooo-ooo | 2-2  |  ···-·1·-··· |
| xxo-ooo-ooo | 2-2  |  ···-·2·-··· |
| xxx-ooo-ooo | 2-2  |  ···-·3·-··· |
| xxx-xoo-ooo | 2-2  |  ···-·4·-··· |
| xxx-xox-ooo | 2-2  |  ···-·5·-··· |
| xxx-xox-xoo | 2-2  |  ···-·6·-··· |
| xxx-xox-xxo | 2-2  |  ···-·7·-··· |
| xxx-xox-xxx | 2-2  |  ···-·8·-··· |
| oxx-oox-xxx | 1-1  |  1··-···-··· |
| oxx-xox-xxx | 1-1  |  2··-···-··· |
| oxx-xxx-xxx | 1-1  |  3··-···-··· |

Scenario: Revealing a cell with 0 count: recursively revealing neighbours
Given the user loads the custom layout
"""
xooo
oooo
oooo
oooo
"""
When the user reveals the cell "4-4"
Then the display shows the layout
"""
·100
1100
0000
0000
"""

Scenario: Tagging a cell with a flag
Given the user loads the default layout
When the user tags the cell "1-1" with "a flag"
Then the cell "1-1" shows "a flag"

Scenario: Tagging a cell with a question mark
Given the user loads the default layout
When the user tags the cell "1-1" with "a question mark"
Then the cell "1-1" shows "a question mark"

Scenario: Untagging a cell with a flag
Given the user loads the default layout
And the user tags the cell "1-1" with "a flag"
When the user untags the cell "1-1"
Then the cell "1-1" shows "nothing"

Scenario: Untagging a cell with a question mark
Given the user loads the default layout
And the user tags the cell "1-1" with "a question mark"
When the user untags the cell "1-1"
Then the cell "1-1" shows "nothing"

Scenario: Winning the game: happy face
Given the user wins the game
Then the smiley shows 'a happy face'

Scenario: Losing the game: sad face
Given the user loses the game
Then the smiley shows 'a sad face'

Scenario: Losing the game: showing all bombs locations
Given the user loads the custom layout 
"""
xoo
oxx
oox
"""
When the user reveals the cell "2-3"
Then the display shows the layout
"""
x··
·xx
··x
"""

Scenario: Loading the remaining flags counter
Given the user loads the custom layout "<layout>"
Then the remaining flags counter shows the value "<flags>"

Examples:
| layout              | flags |
| xoo-oxo-xoo         |   3   |
| ooo-oxo             |   1   |
| oooo-xxxx-oooo-xxxx |   8   |
| oooo-oxox           |   2   |
| oo-xx-ox-xo         |   4   |

Scenario: Loading the timer
Given the user loads the default layout
Then the timer shows the value "0"

Scenario: Resetting the board: resetting defeat state
Given the user loses the game
When the user resets the board
Then the smiley shows 'a neutral face'

@manual
Scenario: Resetting the board: resetting victory state
Given the user wins the game
When the user resets the board
Then the smiley shows 'a neutral face'

@manual
Scenario: Resetting the board: hiding all cells
Given the user loads the default layout
And the user tags the cell "3-4" with "a flag"
And the user reveals the cell "5-2"
When the user reset the board
Then all cells are hidden

@manual
Scenario: Resetting the board: resetting the remaining flags counter
Given the user loads the default layout
And the user tags the cell "3-4" with "a flag"
And the user tags the cell "5-2" with "a flag"
When the user reset the board
Then the remaining flags counter shows the value "10"

@manual
Scenario: Resetting the board: resetting the timer
Given the user loads the custom layout "oxo"
And the user clicks the cell "1-1"
And the user waits "5" seconds
When the user reset the board
Then the timer shows the value "0"

@manual
Scenario: Tagging a cell with a flag: remaining flags counter goes down
Given the user loads the default layout
When the user tags the cell "1-1" with "a flag"
Then the remaining flags counter shows the value "9"

@manual
Scenario: Untagging a cell with a flag: remaining flags counter goes up
Given the user loads the default layout
And the user tags the cell "1-1" with "a flag"
When the user untags the cell "1-1"
Then the remaining flags counter shows the value "10"

@manual
Scenario: Tagging a cell with a question mark: remaining flags counter does not change
Given the user loads the default layout
When the user tags the cell "1-1" with "a question mark"
Then the remaining flags counter shows the value "10"

@manual
Scenario: Incorrectly tagging a cell with a flag: remaining flags counter goes down
Given the user loads the custom layout "xo"
When the user tags the cell "1-2" with "a flag"
Then the remaining flags counter shows the value "1"

@manual
Scenario: Correctly tagging a cell with a flag: game does not end
Given the user loads the custom layout "xo"
When the user tags the cell "1-1" with "a flag"
Then the user has neither lost or won

@manual
Scenario: Tagging a cell with a flag: using more flags than bombs
Given the user loads the layout "xo"
When the user tags all cells with "a flag"
Then the remaining flags counter shows the value "1"

@manual
Scenario: The timer counts time after first click
Given the user loads the custom layout
"""
oox
ooo
xoo
"""
And the user waits "5" seconds
When the user reveals the cell "1-1"
And the user waits "5" seconds
Then the timer shows the value "5"

@manual
Scenario: Using the mouse: Left click to reveal
Given the user loads the layout "xo"
When the user left clicks the cell "1-1"
Then the cell "1-1" is revealed

@manual
Scenario: Using the mouse: Right click once to flag
Given the user loads the default layout
When the user right clicks the cell "1-1"
Then the cell "1-1" shows "a flag"

@manual
Scenario: Using the mouse: Right click twice to tag a question mark
Given the user loads the default layout
And the user right clicks the cell "1-1"
When the user right clicks the cell "1-1"
Then the cell "1-1" shows "a question mark"

@manual
Scenario: Using the mouse: Right click thrice to untag
Given the user loads the default layout
And the user right clicks the cell "1-1"
And the user right clicks the cell "1-1"
When the user right clicks the cell "1-1"
Then the cell "1-1" shows "nothing"

@manual
Scenario: Using the mouse: Pressing the smiley to reset
Given the user loads the default layout
And the user tags the cell "3-4" with "a flag"
And the user reveals the cell "5-2"
When the user presses the smiley
Then the board resets

@manual
Scenario: Random generation: Default layout always has 10 mines
Given the user loads the default layout with all cells visible "100" times
When the user counts how many mines are there
Then there is always "10" mines on the field

@manual @probabilistic
Scenario: Random generation: No cell has more mines than the others
Given the user loads the default layout with all cells visible "1000" times
When the user counts the frequency of each cell having a mine
Then no significant differences are found