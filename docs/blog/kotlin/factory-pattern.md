---
title: Factory Pattern
description: Factory pattern is one of the most popular creational pattern. In factory pattern, we hide the object creation logic from the consumer.
tags:
    - kotlin
    - design
---

# Factory Pattern
Factory pattern is one of the most popular creational pattern. In factory pattern, we hide the object creation logic from the consumer of the factory. We use an interface to return the newly created object. Let's understand this by an example.

We will create:

1. An interface called `Animal`
2. Classes, `Cat`, `Dog`, `Mouse`
2. A factory class called `AnimalFactory`

`Animal` interface:
```
interface Animal {
    fun move()
}
```

`Cat`, `Dog`, `Mouse` classes:
```
class Cat : Animal {
    fun move() {
        print("Cat moves")
    }
}

class Dog : Animal {
    fun move() {
        print("Dog moves")
    }
}

class Mouse : Animal {
    fun move() {
        print("Mouse moves")
    }
}
```

`AnimalFactory` class:
```
class AnimalFactory {
    fun getAnimal(name: String): Animal? {
        return when (name) {
            "cat" -> Cat()
            "dog" -> Dog()
            "mouse" -> Mouse()
            else -> null
        }
    }
}
```