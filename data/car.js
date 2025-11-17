class Car{
  brand;
  model;
  speed;
  constructor(carDetails){
    this.brand=carDetails.brand;
    this.model=carDetails.model
    this.speed=carDetails.speed
  }
  displayInfo(){
    console.log(`car1brand:${this.brand} car1model is:${this.model}`)
  }
}
const car1=new Car({
  brand:'Toyota',
  model:'corolla',
  speed:0
});
car1.displayInfo()
const car2=new Car({
  brand:'Tesla',
  model:'Model3',
  speed:0
});
car2.displayInfo();
console.log(car1);
console.log(car2);