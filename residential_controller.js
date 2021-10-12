//Sets each ID to 1
let [elevatorID,FloorRequestButtonID,callButtonID] = [1,1,1];

//Defines a Column
class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        this.ID = _id;
        this.status = 'idle';
        this.amountOfFloors = _amountOfFloors;
        this.amountOfElevators = _amountOfElevators;
        this.elevatorList = [];
        this.callButtonList = [];
        
        this.createElevators(this.amountOfFloors, this.amountOfElevators);
        this.createCallButtons(this.amountOfFloors);
    }
    //Creates call Button according to the number of Floors
    createCallButtons(amountOfFloors){
        let buttonFloor = 1;

        for (let i = 0; i < amountOfFloors; i++) {
            if (buttonFloor < amountOfFloors) {
                let callButton = new CallButton(callButtonID, buttonFloor, 'up');
                this.callButtonList.push(callButton);
                callButtonID++;
            }
            if (buttonFloor > 1){
                let callButton = new CallButton(callButtonID, buttonFloor, 'down');
                this.callButtonList.push(callButton);
                callButtonID++;
            }
            buttonFloor++;
        }
    }
    //Creates Elevators according to the number of Floors and the number of Elevators
    createElevators(amountOfFloors, amountOfElevators) {
        for (let i = 0; i < amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, amountOfFloors, 1);
            this.elevatorList.push(elevator);
            elevatorID++;
        }
    }
    //Requests an Elevator according a Floor and a Direction choosing the best Elevator
    requestElevator(Floor, Direction) {
        let elevator = this.findElevator(Floor, Direction);
        elevator.floorRequestList.push(Floor);
        elevator.move();
        elevator.operateDoors();
        return elevator;
    }
    //Finds the best Elevator according to the requested Floor and Direction
    findElevator(requestedFloor, requestedDirection) {
        let bestElevator = this.elevatorList[0];
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations = {bestElevator : bestElevator, bestScore : bestScore, referenceGap : referenceGap};

        for (let i = 0; i < this.elevatorList.length; i++) {

            if (requestedFloor == this.elevatorList[i].currentFloor && this.elevatorList[i].status == 'stopped' && requestedDirection == this.elevatorList[i].direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (requestedFloor > this.elevatorList[i].currentFloor && this.elevatorList[i].direction == 'up' && requestedDirection == this.elevatorList[i].direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (requestedFloor < this.elevatorList[i].currentFloor && this.elevatorList[i].direction == 'down' && requestedDirection == this.elevatorList[i].direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (this.elevatorList[i].status == 'idle') {
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else{
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }

            bestElevator = bestElevatorInformations.bestElevator;
            bestScore = bestElevatorInformations.bestScore;
            referenceGap = bestElevatorInformations.referenceGap;
        }

        return bestElevatorInformations.bestElevator;
    }
    //Compares each Elevators to find the best
    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, Floor) { 
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - Floor);
        }
        else if (bestScore == scoreToCheck) {
            let Gap = Math.abs(newElevator.currentFloor - Floor);
            if (referenceGap > Gap) {
                bestElevator = newElevator;
                referenceGap = Gap;
            }
        }
        let bestElevatorInformations = {bestElevator : bestElevator, bestScore : bestScore, referenceGap : referenceGap};
        return bestElevatorInformations;
    }

}
//Defines an Elevator
class Elevator {
    constructor(_id, _amountOfFloors, _currentFloor) {
        this.ID = _id;
        this.status = 'stopped';
        this.amountOfFloors = _amountOfFloors;
        this.currentFloor = _currentFloor;
        this.direction = 'idle';
        this.door = new Door(_id);
        this.floorRequestButtonList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(_amountOfFloors);
    }
    //Creates a Floor request Button in each Elevator according to the number of Floors
    createFloorRequestButtons(amountOfFloors){
        let buttonFloor = 1;
        for (let i = 0; i < amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(FloorRequestButtonID, buttonFloor);
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor++;
            FloorRequestButtonID++;
        }
    }
    
    //Adds the requested Floor to a requests List and call the move() method of the Elevator and the operateDoors() method
    requestFloor(Floor){
        this.floorRequestList.push(Floor);
        this.move();
        this.operateDoors();
    }
    //Moves the Elevator to the requested Floor
    move(){
        while (this.floorRequestList.length != 0) {
            let Destination = this.floorRequestList[0]
            this.status = 'moving';
            if (this.currentFloor < Destination) {
                this.direction = 'up';
                this.sortFloorList();
                while (this.currentFloor < Destination) {
                    this.currentFloor++;
                    this.screenDisplay = this.currentFloor;
                }
            }
            else if (this.currentFloor > Destination) {
                this.direction = 'down';
                this.sortFloorList();
                while (this.currentFloor > Destination) {
                    this.currentFloor--;
                    this.screenDisplay = this.currentFloor;
                }
            }
            this.status = 'stopped'
            this.operateDoors();
            this.floorRequestList.shift();
        }
        this.status = 'idle';
    }
    //Sorts the floor requests List according to the Direction of the Elevator
    sortFloorList(){
        if (this.direction == 'up') {
            this.floorRequestList.sort((a, b) => a - b);
        }
        else{
            this.floorRequestList.sort((a, b) => b - a);
        }
    }
    //Opens and Closes the Doors of the Elevator
    operateDoors(){
        this.door.status = 'opened';
        /*
        Wait 5 seconds before closing the doors
        */
        //setTimeout(() => {
        //    this.door.status = 'closed'; 
        //}, 5000);
        this.door.status = 'closed';
    }
}
//Defines a Call Button
class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = 'off';
        this.floor = _floor;
        this.direction = _direction;
    }
}
//Defines a Floor Request Button
class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = 'off';
        this.floor = _floor;
    }
}
//Defines a Door
class Door {
    constructor(_id,) {
        this.ID = _id;
        this.status = 'off';
    }
}
module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }