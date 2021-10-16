# Rocket-Elevators-Javascript-Controller
## Description

This controller's whole purpose is to handle a personalized amount of elevators with a personalized amount of floors in a single column.

It can be controlled first from the outside of an elevator on each floor and after that, from the inside a specific elevator.

When used called from outside, the column sends the best elevator possible from the user's current floor and direction. Then, when used from the inside of the elevator that was selected by the column, the elevator is moved to the to the user's destination.

Elevator selection is based on the elevator's status, current floor, direction and floor request list and on the user's floor and direction.

## Dependencies

### To be able to try the program with your own settings you need to input:

#### First you need to create a column with the desired amount of floors and elevators in the brackets `{}`:
- Do not write the brackets `{}`
```
let column = new Column(1, {floors}, {elevators})
```
#### After that you need to customized where do you want each elevators to be placed with their status and if they have a direction and an agenda of floors to get to:
- Elevators' current floor and status
- Note that the `0` inside the `[]` represents the elevator you're customizing. If it's the first `(1)` elevator you want to customized you have its real number it's `1 - 1` therefore `0` and so on
```
column.elevatorList[0].currentFloor = {floor}
column.elevatorList[0].status = {idle or moving or stopped} 
column.elevatorList[1]...
column.elevatorList[1]...
```
#### Then if you want, you can customized if you want your elevators to have a direction and pre-made destinations:
- Elevator's `direction` is either up or down or idle and `floor` request list is from 1 to any floor
```
column.elevatorList[0].direction = 'direction'
column.elevatorList[0].floorRequestList.push(floor)
column.elevatorList[1]...
column.elevatorList[1]...
```
#### Finally, to request an elevator you need to input the floor that you are on and which direction you want to go to and then if you want to request a specific floor from inside the elevator you need input the floor you want the elevator to take you to:
- To request an elevator you need your `floor` request list is from 1 to any floor and a `direction` which is either up or down
```
bestElevator = column.requestElevator(floor, direction)
```
- To request a floor from inside the elevator you only need your desired `floor`
```
bestElevator.requestFloor(floor)
```

### And now, to run the tests for this program you need Node JS and NPM installed and then you need to first run in your Terminal:
```
npm install
```

and then, to run the tests, input:

```
npm test
```
