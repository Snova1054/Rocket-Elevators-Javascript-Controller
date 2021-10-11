let [elevatorID,FloorRequestButtonID,callButtonID] = [1,1,1];

class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        this.ID = _id;
        this.Status = 'idle';
        this.amountOfFloors = _amountOfFloors;
        this.amountOfElevators = _amountOfElevators;
        this.elevatorList = [];
        this.callButtonList = [];
        
        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);
    };

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

    createElevators(_amountOfFloors, _amountOfElevators) {
        for (let i = 0; i < _amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, _amountOfFloors, 1);
            this.elevatorList.push(elevator);
            elevatorID++;
        }
    }

    requestElevator(Floor, Direction) {
        let elevator = this.findElevator(Floor, Direction);
        elevator.floorRequestList.push(Floor);
        elevator.move();
        elevator.operateDoors();
        return elevator;
    }

    findElevator(requestedFloor, requestedDirection) {
        let bestElevator = new Elevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations = {bestElevator, bestScore : 5, referenceGap: 10000000};

        for (let i = 0; i < this.elevatorList.length; i++) {
            if (requestedFloor == this.elevatorList[i].currentFloor && this.elevatorList[i].Status == 'stopped' && requestedDirection == this.elevatorList[i].Direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (requestedFloor > this.elevatorList[i].currentFloor && this.elevatorList[i].Direction == 1 && requestedDirection == this.elevatorList[i].Direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (requestedFloor < this.elevatorList[i].currentFloor && this.elevatorList[i].Direction == -1 && requestedDirection == this.elevatorList[i].Direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else if (this.elevatorList[i].Status == 'idle') {
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }
            else{
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, this.elevatorList[i], bestScore, referenceGap, bestElevator, requestedFloor);
            }

            bestElevatorInformations = {bestElevator : bestElevator, bestScore : bestScore, referenceGap : referenceGap};
        }

        return bestElevator;
    }

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
        let bestElevatorInformations = {bestElevator, bestScore, referenceGap};
        return bestElevatorInformations;
    }

}

class Elevator {
    constructor(_id, _amountOfFloors, _currentFloor) {
        this.ID = _id;
        this.Status = 'on';
        this.amountOfFloors = _amountOfFloors;
        this.currentFloor = _currentFloor;
        this.Direction = 'idle';
        this.door = new Door(_id);
        this.floorRequestButtonList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(_amountOfFloors);
    }

    createFloorRequestButtons(amountOfFloors){
        let buttonFloor = 1;
        for (let i = 0; i < amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(FloorRequestButtonID, buttonFloor);
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor++;
            FloorRequestButtonID++;
        }
    }

    requestFloor(Floor){
        this.floorRequestList.push(Floor);
        this.move();
        this.operateDoors();
    }

    move(){
        while (this.floorRequestList.length > 0) {
            let Destination = this.floorRequestList[0]
            this.Status = 'moving';
            if (this.currentFloor < Destination) {
                this.Destination = 1;
                this.sortFloorList();
                while (this.currentFloor < Destination) {
                    this.currentFloor++;
                    this.screenDisplay = this.currentFloor;
                }
            }
            else if (this.currentFloor > Destination) {
                this.Destination = -1;
                this.sortFloorList();
                while (this.currentFloor > Destination) {
                    this.currentFloor--;
                    this.screenDisplay = this.currentFloor;
                }
            }
            this.Status = 'stopped'
            this.floorRequestList.splice(0, 1);
        }
        this.Status = 'idle';
    }

    sortFloorList(){
        if (this.Direction == 1) {
            this.floorRequestList.sort((a, b) => a - b);
        }
        else{
            this.floorRequestList.sort((a, b) => b - a);
        }
    }

    operateDoors(){
        this.door.Status = 'opened';
        setTimeout(() => {
            this.door.Status = 'closed';
        }, 5000);
    }
}

class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = 'off';
        this.floor = _floor;
        this.direction = _direction;
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = 'off';
        this.floor = _floor;
    }
}

class Door {
    constructor(_id,) {
        this.ID = _id;
        this.status = 'off';
    }
}

new results = new Column(1, 10, 2);
results.elevatorList[0].currentFloor =  2;
results.elevatorList[0].status = 'idle';
results.elevatorList[1].currentFloor = 6;
results.elevatorList[1].status = 'idle';

results.requestElevator(3)

module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }