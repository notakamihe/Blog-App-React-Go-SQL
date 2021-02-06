package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID          int    `json:"id"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Post struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Likes     int       `json:"likes"`
	CreatedAt time.Time `json:"createdat"`
	AuthorID  int       `json:"authorid"`
}

type Like struct {
	ID       int `json:"id"`
	PostID   int `json:"postid"`
	AuthorID int `json:"authorid"`
}

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/blog?parseTime=true")

	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	fmt.Println("Successfully connected to MySQL database")

	router := mux.NewRouter()

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	router.HandleFunc("/signup", signUp).Methods("POST")
	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/profiles", getProfiles).Methods("GET", "OPTIONS")
	router.HandleFunc("/profiles/{id}", getProfile).Methods("GET", "OPTIONS")
	router.HandleFunc("/profiles/{id}", updateProfile).Methods("PUT")
	router.HandleFunc("/profiles/{id}", deleteProfile).Methods("DELETE")
	router.HandleFunc("/posts", getPosts).Methods("GET", "OPTIONS")
	router.HandleFunc("/posts/{id}", getPost).Methods("GET", "OPTIONS")
	router.HandleFunc("/posts", createPost).Methods("POST")
	router.HandleFunc("/posts/{id}", updatePost).Methods("PUT")
	router.HandleFunc("/posts/{id}", deletePost).Methods("DELETE")
	router.HandleFunc("/likes", getLikes).Methods("GET")
	router.HandleFunc("/likes", createLike).Methods("POST")
	router.HandleFunc("/likes/{id}", getLike).Methods("GET")
	router.HandleFunc("/likes/{id}", deleteLike).Methods("DELETE")

	fmt.Println("Server started on port 9000")
	log.Fatal(http.ListenAndServe(":9000", handlers.CORS(headers, methods, origins)(router)))
}

func signUp(w http.ResponseWriter, r *http.Request) {
	var user User

	json.NewDecoder(r.Body).Decode(&user)

	if user.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Email is missing.")
		return
	}

	if user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password is missing")
		return
	} else if len(user.Password) < 6 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password is too short. Minimum is 6.")
		return
	}

	if user.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Name is blank.")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

	if err != nil {
		log.Fatal(err)
	}

	user.Password = string(hash)

	statement, err := db.Prepare("INSERT INTO users (email, password, name, description) VALUES(?, ?, ?, ?)")

	_, err = statement.Exec(user.Email, user.Password, user.Name, user.Description)

	if err != nil {
		log.Fatal(err)
	}

	row := db.QueryRow("SELECT * FROM users ORDER BY id DESC LIMIT 1;")
	err = row.Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Description)

	user.Password = ""

	json.NewEncoder(w).Encode(user)
}

func login(w http.ResponseWriter, r *http.Request) {
	var user User

	json.NewDecoder(r.Body).Decode(&user)

	if user.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Email is missing.")
		return
	}

	if user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password is missing.")
		return
	} else if len(user.Password) < 6 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password is too short. Minimum is 6.")
		return
	}

	password := user.Password

	row := db.QueryRow("SELECT * FROM users WHERE email = ?", user.Email)
	err := row.Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Description)

	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("User with this email does not exist.")
			return
		} else {
			log.Fatal(err)
		}
	}

	hashedPassword := user.Password

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode("Invalid password.")
		return
	}

	user.Password = ""

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func getProfiles(w http.ResponseWriter, r *http.Request) {
	var users []User

	result, err := db.Query("SELECT * FROM users")

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	for result.Next() {
		var user User

		err := result.Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Description)

		if err != nil {
			panic(err.Error())
		}

		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)
}

func getProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	result, err := db.Query("SELECT * FROM users WHERE id = ?", params["id"])

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	var user User

	for result.Next() {
		err := result.Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Description)

		if err != nil {
			panic(err.Error())
		}
	}

	if user.ID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Profile not found")
		return
	}

	user.Password = ""

	json.NewEncoder(w).Encode(user)
}

func updateProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	statement, err := db.Prepare("UPDATE users SET name = ?, description = ? WHERE id = ?")

	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		panic(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	newName := keyVal["name"]
	newDescription := keyVal["description"]

	if newName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Name cannot be blank")
		return
	}

	_, err = statement.Exec(newName, newDescription, params["id"])

	if err != nil {
		panic(err.Error())
	}

	fmt.Fprintf(w, "User with ID = %s was updated", params["id"])
}

func deleteProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	statement, err := db.Prepare("DELETE FROM users WHERE id = ?")

	if err != nil {
		log.Fatal(err)
		return
	}

	_, err = statement.Exec(params["id"])

	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Fprintf(w, "User with ID = %s was deleted", params["id"])
}

func getPosts(w http.ResponseWriter, r *http.Request) {
	var posts []Post

	result, err := db.Query("SELECT * FROM posts")

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	for result.Next() {
		var post Post

		err := result.Scan(&post.ID, &post.AuthorID, &post.Title, &post.Content, &post.Likes, &post.CreatedAt)

		if err != nil {
			panic(err.Error())
		}

		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

func getPost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	result, err := db.Query("SELECT * FROM posts WHERE id = ?", params["id"])

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	var post Post

	for result.Next() {
		err := result.Scan(&post.ID, &post.AuthorID, &post.Title, &post.Content, &post.Likes, &post.CreatedAt)

		if err != nil {
			panic(err.Error())
		}
	}

	if post.ID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Post not found")
		return
	}
	json.NewEncoder(w).Encode(post)
}

func createPost(w http.ResponseWriter, r *http.Request) {
	statement, err := db.Prepare("INSERT INTO posts (author_id, title, content) VALUES(?, ?, ?)")

	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		panic(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	authorID, err := strconv.Atoi(keyVal["author_id"])
	var title string = keyVal["title"]
	var content string = keyVal["content"]

	if title == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Title is blank")
		return
	}

	if content == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Content is blank")
		return
	}

	if authorID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("No author")
		return
	}

	_, err = statement.Exec(authorID, title, content)

	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Fprintf(w, "New post created.")
}

func updatePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	statement, err := db.Prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?")

	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		panic(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	newTitle := keyVal["title"]
	newContent := keyVal["content"]

	if newTitle == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Title cannot be blank")
		return
	}

	if newContent == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Content cannot be blank")
		return
	}

	_, err = statement.Exec(newTitle, newContent, params["id"])

	if err != nil {
		panic(err.Error())
	}

	fmt.Fprintf(w, "Post with ID = %s was updated", params["id"])
}

func deletePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	statement, err := db.Prepare("DELETE FROM posts WHERE id = ?")

	if err != nil {
		log.Fatal(err)
		return
	}

	_, err = statement.Exec(params["id"])

	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Fprintf(w, "Post with ID = %s was deleted", params["id"])
}

func getLikes(w http.ResponseWriter, r *http.Request) {
	var likes []Like

	result, err := db.Query("SELECT * FROM likes")

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	for result.Next() {
		var like Like

		err := result.Scan(&like.ID, &like.PostID, &like.AuthorID)

		if err != nil {
			panic(err.Error())
		}

		likes = append(likes, like)
	}

	json.NewEncoder(w).Encode(likes)
}

func createLike(w http.ResponseWriter, r *http.Request) {
	statement, err := db.Prepare("INSERT INTO likes (postid, authorid) VALUES(?, ?)")

	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		panic(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)

	authorID, err := strconv.Atoi(keyVal["authorid"])
	postID, err := strconv.Atoi(keyVal["postid"])

	if authorID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("No author")
		return
	}

	if postID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("No post")
		return
	}

	_, err = statement.Exec(postID, authorID)

	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Fprintf(w, "New like created.")
}

func getLike(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	result, err := db.Query("SELECT * FROM likes WHERE id = ?", params["id"])

	if err != nil {
		panic(err.Error())
	}

	defer result.Close()

	var like Like

	for result.Next() {
		err := result.Scan(&like.ID, &like.PostID, &like.AuthorID)

		if err != nil {
			panic(err.Error())
		}
	}

	if like.ID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Like not found")
		return
	}

	json.NewEncoder(w).Encode(like)
}

func deleteLike(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	statement, err := db.Prepare("DELETE FROM likes WHERE id = ?")

	if err != nil {
		log.Fatal(err)
		return
	}

	_, err = statement.Exec(params["id"])

	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Fprintf(w, "Post with ID = %s was deleted", params["id"])
}
