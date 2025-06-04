//Milestone 1
type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

//Milestone 2
type Nationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese";


type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: Nationality
}


//Milestone 3 
function isActress(dati: unknown): dati is Actress {
  if (typeof dati !== 'object' || dati === null) {
    return false;
  }
  return (
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    (!("death_year" in dati) || typeof dati.death_year === 'number') &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(movie => typeof movie === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:5000/actresses/${id}`)
    if (!response.ok) {
      throw new Error('Errore HTTP')
    }
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error('Formato dati non valido')
    }
    return dati
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto', error)
    }
    return null
  }
}



//Milestone 4
async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch('http://localhost:5000/actresses');
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error('Formato dei dati diverso da un array')
    }
    const validActress: Actress[] = dati.filter(d => isActress(d));
    return validActress;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto', error)
    }
    return []
  }
}


//Milestone 5
async function getActresses(id: number[]): Promise<(Actress | null)[]> {
  try {
    const everyPromise = id.map(i => getActress(i));
    return await Promise.all(everyPromise)
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto', error)
    }
    return []
  }
}