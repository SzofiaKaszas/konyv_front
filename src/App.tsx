import { useEffect, useState } from 'react'
import './App.css'

interface Book {
  id: number,
  title: string,
  author: string,
  publish_year: number,
  page_count: number
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const URL = "http://localhost:3000/api"

  async function getBooks() {
    const res = await fetch(URL + "/books", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
      console.log("hiba")
      return
    }

    const result = (await res.json()) as Book[];
    setBooks(result)
  }

  useEffect(() => {
    getBooks()
  }, [])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    document.getElementById("error")!.innerHTML = "";

    const form = new FormData(e.currentTarget)

    const title = form.get("title") as string
    const author = form.get("author") as string
    const publish_year = Number(form.get("publishYear"))
    const page_count = Number(form.get("pageCount"))

    if (title == "" || author == "" || !publish_year || !page_count) {
      document.getElementById("error")!.innerHTML = "Minden mezőt ki kell tölteni";
    }

    if (publish_year <= 0 || page_count <= 0) {
      document.getElementById("error")!.innerHTML = "A számoknak nagyobbnak kell lennie 0-nál"
    }

    const res = await fetch(URL + "/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        author: author,
        publish_year: publish_year,
        page_count: page_count
      })
    })

    if (res.status === 400) {
      const errorObj = await res.json();
      const errors = errorObj.message as string[];
      errors.forEach(error => {
        document.getElementById("error")!.innerHTML += error
      });
      return;
    }

    getBooks();
    e.target.reset();
  }

  async function rent(id: number) {
    const res = await fetch(URL + `/books/${id}/rent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (res.status === 404) {
      const errorObj = await res.json();
      const errors = errorObj.message as string[];
      alert(errors)
      return;
    }
    else if (res.status === 409) {
      const errorObj = await res.json();
      const errors = errorObj.message as string[];
      alert(errors)
      return;
    }
    else if (res.status === 400) {
      const errorObj = await res.json();
      const errors = errorObj.message as string[];
      alert(errors)
      return;
    }
    else if (res.status === 500) {
      const errorObj = await res.json();
      const errors = errorObj.message as string[];
      alert(errors)
      return;
    }

    alert("Sikeres foglalás!")
  }

  return (
    <>
      <header>
        <h1>Petrik Könyvtár Nyilvántartó</h1>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#ujkonyv">Új könyv</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="https://petrik.hu/">Petrik honlap</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className='container-fluid'>
        <div className='row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mb-4'>
          {books.map((book) => (
            <div className="card border border-dark" style={{ alignItems: "center" }} key={book.id}>
              <div className="card-body">
                <h4 className="card-title">{book.title}</h4>
                <h5 className="card-title">{book.author}</h5>
                <div className="card-text">Kiadási év: {book.publish_year}</div>
                <div className='card-text'>Hossz: {book.page_count} oldal</div>
                <img src={`./authors/${book.author}.jpg`} className="card-img-top" alt={book.author} style={{ width: "500px" }}></img>
                <button className='btn btn-dark' onClick={() => rent(book.id)}>Kölcsönzés</button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => handleSubmit(e)} id='ujkonyv'>
          <h2>Új könyv hozzáadása</h2>

          <label htmlFor='title'>Cím: </label>
          <input type='text' name='title' id='title' required></input><br></br>

          <label htmlFor='author'>Író: </label>
          <input type='text' name='author' id='author' required></input><br></br>

          <label htmlFor='publishYear'>Kiadási év: </label>
          <input type='number' name='publishYear' id='publishYear' required></input><br></br>

          <label htmlFor='pageCount'>Oldalszám:</label>
          <input type='number' name='pageCount' id='pageCount' required></input><br></br>

          <p id='error' className='text-danger'></p>

          <button type='submit' className='btn btn-dark'>Új könyv</button>
        </form>
      </main>
      <footer>
        <p>Készítette: Kaszás Szófia</p>
      </footer>
    </>
  )
}

export default App
