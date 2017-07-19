The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.
> Object.assign(target, ...sources)

Return : The target object.


The Object.create() method creates a new object with the specified prototype object and properties.
> Object.create(proto[, propertiesObject]);

Return : A new object with the specified prototype object and properties.

The Object.defineProperties() method defines new or modifies existing properties directly on an object, returning the object.
> Object.defineProperties(obj, props)

Return : The object that was passed to the function.

The Object.defineProperty() method defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
> Object.defineProperty(obj, prop, descriptor)

Return : The object that was passed to the function.

The Object.freeze() method freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed.  The method returns the object in a frozen state.
> Object.freeze(obj)

Return : The frozen object.

The Object.getPrototypeOf() method returns the prototype (i.e. the value of the internal [[Prototype]] property) of the specified object.
> Object.getPrototypeOf(obj)

Return : The prototype of the given object. If there are no inherited properties, null is returned.


The Object.setPrototypeOf() method sets the prototype (i.e., the internal [[Prototype]] property) of a specified object to another object or null.
> Object.setPrototypeOf(obj, prototype);

Return : The specified object.

