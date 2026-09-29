export type Project = {
  id: string
  name: string
  neighbourhood: string
  address: string
  coordinates: [number, number]
  image: string
  href: string
  levels: string
  homes: string
  precision: 'parcel' | 'street' | 'neighbourhood'
  locationNote: string
}

export const projects: Project[] = [
  { id:'alaaya', name:'Amara Alaaya', neighbourhood:'Koyambedu', address:'Poonamallee High Road, Koyambedu, Chennai 600107', coordinates:[80.1991105,13.0760934], image:'/project-cards/alaaya.jpg', href:'https://www.amarahomes.in/alaaya.html', levels:'24 levels', homes:'136 residences', precision:'street', locationNote:'RERA verifies S.Nos. 169/1–4 on Poonamallee High Road. Pin uses the verified road segment because a public parcel centroid is unavailable.' },
  { id:'aanya', name:'Amara Aanya', neighbourhood:'Alwarpet', address:'Old 122 / New 189, St. Mary’s Road, Alwarpet, Chennai 600018', coordinates:[80.2553915,13.0290981], image:'/project-cards/aanya.jpg', href:'https://www.amarahomes.in/aanya.html', levels:'17 levels', homes:'38 residences', precision:'parcel', locationNote:'Door number verified in public project documentation; coordinates resolve to the St. Mary’s Road address.' },
  { id:'anika', name:'Amara Anika', neighbourhood:'Egmore', address:'Montieth Road / Red Cross Road, Egmore, Chennai 600008', coordinates:[80.259786,13.0665616], image:'/project-cards/anika.jpg', href:'https://www.amarahomes.in/anika.html', levels:'9 levels', homes:'Signature residences', precision:'parcel', locationNote:'Official page identifies Montieth Road; public registration records identify New 11, Red Cross Road. Pin is placed at that mapped Montieth Road address.' },
  { id:'avira', name:'Amara Avira', neighbourhood:'T. Nagar', address:'Vijayaraghava Road, T. Nagar, Chennai 600017', coordinates:[80.2427865,13.0436517], image:'/project-cards/avira.jpg', href:'https://www.amarahomes.in/avira.html', levels:'14 levels', homes:'14 residences', precision:'street', locationNote:'RERA and official project sources verify the road and survey reference; the pin uses the verified street geometry.' },
  { id:'aneja', name:'Amara Aneja', neighbourhood:'T. Nagar', address:'Old 12 / New 23, South Boag Road, T. Nagar, Chennai 600017', coordinates:[80.2379771,13.0321659], image:'/project-cards/aneja.jpg', href:'https://www.amarahomes.in/aneja.html', levels:'5 levels', homes:'13 residences', precision:'street', locationNote:'Door number is verified in public business records; pin uses the mapped South West Boag Road segment.' },
  { id:'adhyatma', name:'Amara Adhyatma', neighbourhood:'Abhiramapuram', address:'Plot 5, Door 7/9/10, Sundararajan Street, Abhiramapuram, Chennai 600018', coordinates:[80.2544321,13.0310859], image:'/project-cards/adhyatma.jpg', href:'https://www.amarahomes.in/adhyatma.html', levels:'5 levels', homes:'10 residences', precision:'street', locationNote:'RERA verifies Sundararajan Street, formerly Abhiramapuram 4th Street. Pin uses that mapped street segment.' },
  { id:'sarita', name:'Amara Sarita', neighbourhood:'Poes Garden', address:'Poes Garden, Chennai 600086', coordinates:[80.254278,13.04272], image:'/project-cards/sarita.jpg', href:'https://www.amarahomes.in/sarita.html', levels:'5 levels', homes:'5 residences', precision:'neighbourhood', locationNote:'Amara confirms a private dead-end road in Poes Garden, but no public door number is published. Pin is an address-area placement, not a claimed parcel centroid.' },
  { id:'sesha', name:'Amara Sesha', neighbourhood:'Poes Garden', address:'10/2, George Avenue, Poes Garden, Chennai 600018', coordinates:[80.2556198,13.0440757], image:'/project-cards/sesha.jpg', href:'https://www.amarahomes.in/sesha.html', levels:'5 levels', homes:'5 residences', precision:'street', locationNote:'Door number is verified in public business records; pin is placed on the mapped George Avenue segment.' },
  { id:'avika', name:'Amara Avika', neighbourhood:'Poes Garden', address:'8 Binny Road / 27–59 Poes Garden, Chennai 600086', coordinates:[80.2545679,13.0457407], image:'/project-cards/avika.jpg', href:'https://www.amarahomes.in/avika.html', levels:'4 levels', homes:'5 residences', precision:'street', locationNote:'Public project and business records verify the Binny Road / Poes Garden address; pin uses the mapped street.' },
  { id:'antara', name:'Amara Antara', neighbourhood:'Nungambakkam', address:'Old 1 / New 9, Kothari Road, Nungambakkam, Chennai 600034', coordinates:[80.2388932,13.0627392], image:'/project-cards/antara.jpg', href:'https://www.amarahomes.in/antara.html', levels:'5 levels', homes:'15 residences', precision:'street', locationNote:'Door number is verified in public business records; pin uses the mapped Kothari Road segment.' }
]
