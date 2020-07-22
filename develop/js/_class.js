
export class Teacher {

  constructor( name, position, degree, specialty, currentRI, image ) {
    this.name = name;
    this.position = position;//役職
    this.degree = degree;//学位
    this.specialty = specialty;//専門分野
    this.currentRI = currentRI;//現在の研究対象
    this.image = image;
  }

  // fullName() {
  //   return this.name + this.position;
  // }


}
