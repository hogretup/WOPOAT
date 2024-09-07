import typing as t
from enum import Enum

class Action(Enum):
    PUSH = "Push"
    POP = "Pop"
    TRUNCATE = "Truncate"
    PRINT = "Print"
    JUMP = "Jump"
    JUMP_IF_EMPTY = "Jump if empty"

class Instruction:
    
    def __init__(self, action: 'Action', argument: t.Optional[t.Union[int, str]] = None):
        self.action = action
        self.argument = argument
    
    def splitInstruction(self):
        return self.action, self.argument

    def __str__(self):
        return f"{self.action.value} {str(self.argument)}"

class Solution:

    def __init__(self):
        self.stack = []
        self.currLinesAddedAtIndex = None
        self.transformedInstructions = None

    def execute(self, instructions: t.List[Instruction]):
        if not instructions:
            return
        transformedInstructions = self.transform(instructions)
        self.transformedInstructions = transformedInstructions
        lengthInstructions = len(transformedInstructions)
        currLine = 0

        instruction = self.getInstructionAtLine(currLine)
        while instruction:    
            nextLine = self.performInstruction(instruction, currLine)
            if nextLine >= lengthInstructions:
                break
        
            instruction = self.getInstructionAtLine(nextLine)
            currLine = nextLine

    def performInstruction(self, instruction: Instruction, currLine) -> Instruction:
        action, arg = instruction.splitInstruction()
        if action == Action.PUSH:
            self.stack.append(arg)
            currLine += 1
        elif action == Action.POP:
            self.stack.pop()
            currLine += 1
        elif action == Action.TRUNCATE:
            topMostString = self.stack.pop()
            newString = topMostString[:-arg]
            self.stack.append(newString)
            currLine += 1
        elif action == Action.PRINT:
            print(self.stack[-1])
            currLine += 1
        elif action == Action.JUMP:
            currLine = arg
        elif action == Action.JUMP_IF_EMPTY:
            if self.stack[-1] == "":
                currLine = arg
            else:
                currLine += 1
        return currLine

    def getInstructionAtLine(self, lineNumber):
        return self.transformedInstructions[lineNumber]


    def transform(self, instructions: t.List[Instruction]) -> t.List[Instruction]:
        newInstructions = []
        self.generateCurrLinesAtIndex(instructions)
        newInstructions = self.addLoggingStatements(instructions)
        return newInstructions

    def generateCurrLinesAtIndex(self, instructions: t.List[Instruction]):
        currLinesAddedAtIndex = [0]
        for instruction in instructions:
            action, argument = instruction.splitInstruction()
            currNumLinesAdded = currLinesAddedAtIndex[-1]
            if action == Action.JUMP:
                currNumLinesAdded += 3
            elif action == Action.JUMP_IF_EMPTY:
                currNumLinesAdded += 5
            currLinesAddedAtIndex.append(currNumLinesAdded)
        self.currLinesAddedAtIndex = currLinesAddedAtIndex
    
    def addLoggingStatements(self, instructions: t.List[Instruction]):
        currLineIndex = 0
        newInstructions = []
        for instruction in instructions:
            action, _ = instruction.splitInstruction()
            if action == Action.JUMP:
                newInstructions.extend(self.addLoggingForJump(instruction))
                instruction = self.modifiedJumpStatement(instruction) #this modifies the jump statement using currLinesAdded
                currLineIndex += 3

            elif action == Action.JUMP_IF_EMPTY:
                newInstructions.extend(self.addLoggingForJumpIfEmpty(instruction, currLineIndex))
                instruction = self.modifiedJumpIfEmptyStatement(instruction) #this modifies the jump if empty statement using the currLinesAdded
                currLineIndex += 5

            newInstructions.append(instruction)
            currLineIndex += 1
        return newInstructions

    def addLoggingForJump(self, instruction):
        _, line = instruction.splitInstruction()
        output = [Instruction(Action.PUSH, f"Jumping to line {line}"), Instruction(Action.PRINT), Instruction(Action.POP)]
        return output

    def addLoggingForJumpIfEmpty(self, instruction, index):
        _, line = instruction.splitInstruction()
        output = [Instruction(Action.JUMP_IF_EMPTY, index + 2), Instruction(Action.JUMP, index + 6), Instruction(Action.PUSH, f"Jumping to line {line}"), Instruction(Action.PRINT), Instruction(Action.POP)]
        return output

    def modifiedJumpStatement(self, instruction):
        _, line = instruction.splitInstruction()
        return Instruction(Action.JUMP, line + self.currLinesAddedAtIndex[line])

    def modifiedJumpIfEmptyStatement(self, instruction):
        _, line = instruction.splitInstruction()
        return Instruction(Action.JUMP_IF_EMPTY, line + self.currLinesAddedAtIndex[line])

instructions = [
    Instruction(Action.PUSH, "lol"),            # 0. Push ""
    Instruction(Action.JUMP_IF_EMPTY, 1),    # 1. Jump if empty 1
    Instruction(Action.PUSH, "hello"),       # 2. Push "hello"
    Instruction(Action.PRINT),              # 3. Jump 3
    Instruction(Action.JUMP, 1)
]

soln = Solution()
soln.execute(instructions)



"""
Write a function transform(programme) -> programme that returns a valid programme that provides the
debugging functionality

    Example 1:
    0. Push "hello"
    1. Jump 1

    ->
    0. Push "hello"
    1. Push "jumping to line 1"
    2. Print
    3. Pop
    4. Jump 1

    [0,0,3]

    Example 2:
    0. Jump 1
    1. Push "hello"

    ->
    0. Push "jumping to line 1"
    1. Print
    2. Pop
    3. Jump 4
    4. Push "hello"

    Example 3:
    0. Jump 1
    1. Push "hello"
    2. Jump 3
    3. Push "hello"
    4. Jump 0


    ->
    0. Push "jumping to line 1"
    1. Print
    2. Pop
    3. Jump 4
    4. Push "hello"
    5. Push "jumping to line 0"
    6. Print
    7. Pop
    8. Jump 9
    9. Push "hello"
    10. Push "jumping to line 0"
    11. Print
    12. Pop
    13. Jump 0

    For simplicity sake, lets assume that i have some function insertLogging(lineToJumpTo):
    that takes in a jump statements and inserts the 3 statements before that and the logging is for <lineToJumpTo>.

    Case 1: if the jump statement jumps to a line before itself, no need to update
    Case 2: if the jump statement jumps to a line after itself, need to update by +3

    For Jump only, we can iterate through the instructions and keep adding all these instructions. While doing this, store some type of array representing how many logging lines have been added up to that index
    So in the second case, the array is [0,3,3,6,6,9]

    0. Push ""
    1. Jump if empty 1
    2. Push "hello"
    3. Jump 3

    0. Push ""
    1. Jump if empty 3 <this one can be generated immediately>
    2. Jump 7 <this one can also be generated immediately, its just curr line + 5 since ure iterating from the start
    3. Push "Jumping to line 1"
    4. Print
    5. Pop
    6. Jump if empty 1
    7. Push "hello"
    8. Push "jumping to line 3"
    9. Print
    10. Pop
    11. Jump 8

    [0,0,5,5,5]
"""