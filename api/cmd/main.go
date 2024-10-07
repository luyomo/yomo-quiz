package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
  "time"
  "fmt"
  "io"
  "encoding/json"

  "database/sql"
  _ "github.com/go-sql-driver/mysql"
)

func main() {
  r := gin.Default()
  r.GET("/api/v1/eiken-level-info", func(c *gin.Context) {
    retData := fetchEikenPhase()
    c.String(http.StatusOK, string(retData))
  })

  r.GET("/api/v1/eiken-words", func(c *gin.Context) {
    retData := fetchEikenWords()
    c.String(http.StatusOK, string(retData))
  })

  r.GET("/api/v1/science/pictorial/plant", func(c *gin.Context) {
    user := c.Query("user")
    dataType := c.Query("type")
    switch dataType {
      case "new":
        retData := fetchSciencePictorialPlantNew(&user)
        c.String(http.StatusOK, string(retData))
      case "failure":
        retData :=  fetchSciencePictorialPlantFailure(&user)
        c.String(http.StatusOK, string(retData))
      default:
        fmt.Printf("Unsupported type: %s \n", dataType)
    }
  })

  r.GET("/api/v1/science/pictorial/pic-read", func(c *gin.Context) {
    user := c.Query("user")
    dataType := c.Query("type")
    switch dataType {
      case "new":
//        retData := fetchSciencePictorialPlantNew(&user)
//        c.String(http.StatusOK, string(retData))
      case "failure":
//        retData :=  fetchSciencePictorialPlantFailure(&user)
//        c.String(http.StatusOK, string(retData))
      default:
        retData := fetchSciencePic(user)
        c.String(http.StatusOK, string(retData))
//        fmt.Printf("Unsupported type: %s \n", dataType)
    }
  })
 

  r.POST("/api/v1/science/pictorial/plant", func(c *gin.Context) {
    byteData, err := io.ReadAll(c.Request.Body)
    if err != nil {
        // Handle error
    }
    fmt.Printf("The json Data: %#v \n", string(byteData) )

    var jsonData PostSciencePictorialPlant
    json.Unmarshal(byteData, &jsonData)
    fmt.Printf("Json parsed data: %#v \n", jsonData)

    err = postSciencePictorialPlant(jsonData)
    if err != nil {
      c.String(http.StatusOK, "Failure")
    } else {
      c.String(http.StatusOK, "Successful")
    }
  })

  r.Run(":28080")
}

type EikenLevelInfo struct {
    Id       int             `json:"id"`
    Category string          `json:"category"`
    Level    string          `json:"level"`
    Section  string          `json:"section"`
    SubLevel string          `json:"sublevel"`
    Display  string          `json:"display"`
    Comment  sql.NullString  `json:"Comment"`
}

type EikenWords struct {
    Id        int    `json:"id"`
    Seq       int    `json:"seq"`
    LevelID   int    `json:"levelid"`
    EnWord    string `json:"enword"`
    JpWord    string `json:"jpword"`
    EnExample string `json:"enexample"`
    JpExample string `json:"jpexample"`
}

func checkErr(err error) {
    if err != nil {
        panic(err)
    }
}

func fetchEikenPhase() []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrInfo []EikenLevelInfo

  rows , err := db.Query("select id, category, level, section, subLevel, display, comment from eikenLevelInfo")
  checkErr(err)
  for rows.Next() {
    var info EikenLevelInfo
    err = rows.Scan(&info.Id, &info.Category, &info.Level, &info.Section, &info.SubLevel, &info.Display, &info.Comment)
    checkErr(err)
    arrInfo = append(arrInfo, info)
  }

  fmt.Printf("%#v", arrInfo)
  bytesInfo, err := json.Marshal(arrInfo)
  if err != nil {
    panic(err)
  }
  fmt.Printf("%#v", bytesInfo)
  db.Close()
  return bytesInfo
}

func fetchEikenWords() []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrWords []EikenWords

  rows , err := db.Query("select id, seq, levelID, enWord, jpWord, enExample, jpExample from eikenWords")

  checkErr(err)
  for rows.Next() {
    var word EikenWords
    err = rows.Scan(&word.Id, &word.Seq, &word.LevelID, &word.EnWord, &word.JpWord, &word.EnExample, &word.JpExample)
    checkErr(err)
    arrWords = append(arrWords, word)
  }

  bytesWords, err := json.Marshal(arrWords)
  if err != nil {
    panic(err)
  }
  db.Close()
  return bytesWords
}

type SciencePictorialPlant  struct {
    Sequence        int      `json:"sequence"`
    Question        string   `json:"question"`
    Answers         []string `json:"answers"`
    CorrectAnswer   string   `json:"correct_answer"`
    Category        string   `json:"category"`

    Answer          int      `json:"answer"`
    IsCorrect       int      `json:"is_correct"`
}

type PostSciencePictorialPlant struct {
    User                  string                   `json:"user"`
    SciencePictorialPlant []SciencePictorialPlant  `json:"data"`
}

func fetchSciencePictorialPlantNew(user *string) []byte {
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t3.* from science_choice_qa_test t1 inner join science_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id right join science_choice_qa t3 on t2.question_id = t3.sequence where t2.question_id is null order by t3.sequence limit 5`, *user))
}

func fetchSciencePictorialPlantFailure(user *string) []byte {
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t2.* from (select rank() over (partition by t2.question_id order by t1.create_at desc) as rank , t2.question_id, t1.create_at, t2.is_correct from science_choice_qa_test t1 inner join science_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id ) t1 inner join science_choice_qa t2 on t1.rank = 1 and t1.is_correct = 0 and t2.sequence = t1.question_id limit 5`, *user))
}

func fetchSciencePictorialPlant(query string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

   var arrData []SciencePictorialPlant

   rows, err := db.Query(query) 

   checkErr(err)
   for rows.Next() {
     var row SciencePictorialPlant
     answers := make([]string, 6);

     err = rows.Scan(&row.Sequence, &row.Question, &(answers[0]), &(answers[1]), &(answers[2]), &(answers[3]), &(answers[4]), &(answers[5]), &row.CorrectAnswer, &row.Category)
     checkErr(err)

     for _, answer := range answers {
       if answer != "" {
         row.Answers = append(row.Answers, answer)
       }
     }
     arrData = append(arrData, row)
   }

   bytesData, err := json.Marshal(arrData)
   if err != nil {
     panic(err)
   }
   db.Close()
   return bytesData
}

func postSciencePictorialPlant(reqData PostSciencePictorialPlant) error  {

  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  defer db.Close()

  tx, err := db.Begin()

  queryString := "insert into science_choice_qa_test(userAccount) values (?)"

  response, err := tx.Exec(queryString, reqData.User)

  if err != nil {
     fmt.Printf("Failed to insert data: %#v \n", err)
     tx.Rollback()
     return err
  }

  testId, err := response.LastInsertId()
  if err != nil {
     fmt.Printf("Failed to get Last insert id: %#v \n", err)
     tx.Rollback()
     return err
  }

  queryString = "insert into science_choice_qa_hist(test_id, sequence, question_id, answer, is_correct, time_taken) values (?, ?, ?, ?, ?, ?)"
  for idx, row := range reqData.SciencePictorialPlant {
    var isCorrect bool
    if row.IsCorrect == 1 {
      isCorrect = true
    }else {
      isCorrect = false
    }

    var err error
    if row.Answer == 9 {
        _, err = tx.Exec(queryString, testId, idx, row.Sequence, "Unknow question", isCorrect, 0)
    } else {
        _, err = tx.Exec(queryString, testId, idx, row.Sequence, row.Answers[row.Answer - 1], isCorrect, 0)
    }

    if err != nil {
       fmt.Printf("Failed to insert data: %#v \n", err)
       tx.Rollback()
       return err
    }
  }


  fmt.Printf("Response data: %#v \n", testId)
  tx.Commit()
  return nil
}


type SciencePic struct {
  Sequence int    `json:"sequence"`
  Question string `json:"question"`
  Category string `json:"category"`
  Urls     string `json:"urls"`
}

func fetchSciencePic(user string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrData []SciencePic 

  rows, err := db.Query("select sequence, question, category, urls from science_pictorial_qa") 

  checkErr(err)
  for rows.Next() {
    var row SciencePic

    err = rows.Scan(&row.Sequence, &row.Question, &row.Category, &row.Urls)
    checkErr(err)

    arrData = append(arrData, row)
  }

  bytesData, err := json.Marshal(arrData)
  if err != nil {
    panic(err)
  }
  db.Close()
  return bytesData
}
