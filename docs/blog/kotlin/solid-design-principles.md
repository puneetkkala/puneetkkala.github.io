---
tags:
    - kotlin
    - design
---

# SOLID Design Principles
S - Single Responsibility Principle<br/>
O - Open / Closed Principle<br/>
L - Liskov Substitution Principle<br/>
I - Interface Segregation Principle<br/>
D - Dependency Inversion Principle<br/>
## Single Responsibility Principle (SRP)
SRP states that a module should have one, and only one reason to change. Each module should have a single responsibility or job to do, so that changes to that responsibility do not affect other parts of the system.
### Violation
`User` class manages user data and sends email or downloads profile.
```
data class User(
    val id: String,
    val email: String
) {
    fun sendEmail() {
        // sends email from the user
    }

    fun downloadProfile() {
        // download profile of the user
    }
}
```
### Solution
`User` class only manages user data, `EmailSender` class only sends email, and `ProfileDownloader` class only downloads profile.
```
data class User(
    val id: String,
    val email: String
)

class EmailSender {
    fun sendEmail(user: User) {
        // sends email from the user
    } 
}

class ProfileDownloader {
    fun downloadProfile(user: User) {
        // download profile of the user
    }
}
```
## Open / Closed Principle (OCP)
OCP states that a module should be open for extension but closed for modification. You should be able to add a new feature to a module without changing its existing code. 
### Violation
We have logic for two vehicle bike and car.
```
enum class Vehicle {
    BIKE,
    CAR
}

class VehicleMover {

    fun moveVehicle(vehicle: Vehicle) {
        when (vehicle) {
            Vehicle.BIKE -> {
                // logic to ride bike
            }
            Vehicle.CAR -> {
                // logic to drive car
            }
        }
    }
}
```
To add airplane and boat, we will have to modify the `Vehicle` enum class and `VehicleMover` class.
```
enum class Vehicle {
    BIKE,
    CAR,
    AIRPLANCE,
    BOAT
}

class VehicleMover {

    fun moveVehicle(vehicle: Vehicle) {
        when (vehicle) {
            Vehicle.BIKE -> {
                // logic to ride bike
            }
            Vehicle.CAR -> {
                // logic to drive car
            }
            Vehicle.AIRPLANE -> {
                // logic to fly plane
            }
            Vehicle.BOAT -> {
                // logic to sail boat
            }
        }
    }
}
```
### Solution
We can create `Vehicle` interface with move method and modify vehicle mover class as follows:
```
interface Vehicle {
    fun move()
}

class VehicleMover {

    fun moveVehicle(vehicle: Vehicle) {
        vehicle.move()
    }
}
```
The bike, car, airplane, boat classes will handle their own move logic, this way we will be able to add vehicles without modifying `VehicleMover` class.
```
class Bike : Vehicle {

    override fun move() {
        // logic to ride bike
    }
}

class Car : Vehicle {

    override fun move() {
        // logic to drive car
    }
}

class Airplane : Vehicle {

    override fun move() {
        // logic to fly plane
    }
}

class Boat : Vehicle {

    override fun move() {
        // logic to sail boat
    }
}
```
## Liskov Substitution Principle (LSP)
LSP states that you should be able to use any subclass of a class in place of its parent class without causing problems or errors in the program.

### Violation
`AnimalWalker` and `AnimalSwimmer` classes accept Animal, but `AnimalWalker` will throw error for `Whale` and `AnimalSwimmer` will throw error for `Elephant`.
```
interface Animal {
    fun walk()
    fun swim()
}

class Elephant : Animal {

    override fun walk() {
        // logic to walk
    }

    override fun swim() {
        throw Exception("Elephant cannot swim")
    }
}

class Turtle : Animal {

    override fun walk() {
        // logic to walk
    }

    override fun swim() {
        // logic to swim
    }
}

class Whale : Animal {

    override fun walk() {
        throw Exception("Whale cannot walk")
    }

    override fun swim() {
        // logic to swim
    }
}

class AnimalWalker {

    fun walkAnimal(animal: Animal) {
        animal.walk()
    }
}

class AnimalSwimmer {

    fun swimAnimal(animal: Animal) {
        animal.swim()
    }
}
```
### Solution
We created two interfaces `WalkingAnimal` and `SwimmingAnimal`. `AnimalWalker` accepts `WalkingAnimal` and `AnimalSwimmer` accepts `SwimmingAnimal`. This way they can be substituted without any errors.
```
interface WalkingAnimal {
    fun walk()
}

interface SwimmingAnimal {
    fun swim()
}

class Elephant : WalkingAnimal {
    
    override fun walk() {
        // logic to walk
    }
}

class Turtle : WalkingAnimal, SwimmingAnimal {

    override fun walk() {
        // logic to walk
    }

    override fun swim() {
        // logic to swim
    }
}

class Whale : SwimmingAnimal {

    override fun swim() {
        // logic to swim
    }
}

class AnimalWalker {

    fun walkAnimal(animal: WalkingAnimal) {
        animal.walk()
    }
}

class AnimalSwimmer {

    fun swimAnimal(animal: SwimmingAnimal) {
        animal.swim()
    }
}
```
## Interface Segregation Principle (ISP)
ISP states that a module should not be forced to depend on interfaces it does not use. You should design interfaces that is specific to need of a module rather than having one interface satisfying needs of all modules.
### Violation
Class `ClickUiComponent` had to override both `onClick` and `onLongClick` method where it just needed the `onClick` method.
```
interface OnClickListener {
    fun onClick()
    fun onLongClick()
}

class ClickUiComponent : OnClickListener {

    override fun onClick() {
        // handle click
    }

    override fun onLongClick() {
        // don't need to handle
    }
}
```
### Solution
We segregated `onClick` and `onLongClick` methods two separate interfaces so that we only use the required interface with `onClick` method.
```
interface OnClickListener {
    fun onClick()
}

interface OnLongClickListener {
    fun onLongClick()
}

class ClickUiComponent : OnClickListener {

    override fun onClick() {
        // handle click
    }
}
```
## Dependency Inversion Principle (DIP)
DIP states that high-level modules should not depend on low-level modules; both should depend on abstractions. You should design your software so that modules depend on abstract concepts, rather than concrete implementation details.
### Violation
`EmailSender` class is dependent on `Gmail`.
```
class Gmail {
    fun sendEmail(message: String) {
        // logic to send email via gmail
    }
}

class EmailSender {

    fun sendEmail(message: String) {
        val gmail = Gmail()
        gmail.sendEmail(message)
    }
}

```
If we need to use `Outlook` we will have to change implementation of `EmailSender`.
```
class Outlook {
    fun sendEmail(message: String) {
        // logic to send email via outlook
    }
}

class EmailSender {

    fun sendEmail(message: String) {
        val outlook = Outlook()
        outlook.sendEmail(message)
    }
}
```
### Solution
`EmailSender` is not dependent on `Gmail` or `Outlook` but on `EmailProvider`. It doesn't know which email provider is being used.
```
interface EmailProvider {

    fun sendEmail(message: String)
}

class Gmail : EmailProvider {

    override fun sendEmail(message: String) {
        // logic to send email using gmail
    }
}

class Outlook : EmailProvider {

    override fun sendEmail(message: String) {
        // logic to send email using outlook
    }
}

class EmailSender(private val emailProvider: EmailProvider) {

    fun sendEmail(message: String) {
        emailProvider.sendEmail(message)
    }
}
```