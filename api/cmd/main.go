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

  r.GET("/api/v1/menu", func(c *gin.Context) {
  user := c.Query("user")
  ret := fetchMenu(user)
  c.String(http.StatusOK, string(ret))
//    switch dataType {
//      case "new":
//        retData := fetchHistoryChoiceNew(&user)
//        c.String(http.StatusOK, string(retData))
//      case "failure":
//        retData := fetchHistoryChoiceFailure(&user)
//        c.String(http.StatusOK, string(retData))
//      default:
//        fmt.Printf("Unsupported type: %s \n", dataType)
//    }
  })

  r.GET("/api/v1/question-list/level02", func(c *gin.Context) {
    questionType := c.Query("questionType")
    level01      := c.Query("level01")

    retData := fetchChoiceQALevel02(questionType, level01)
    c.String(http.StatusOK, string(retData))
  })

  r.GET("/api/v1/question-list/level03", func(c *gin.Context) {
    questionType := c.Query("questionType")
    level01      := c.Query("level01")
    level02      := c.Query("level02")

    retData :=  fetchChoiceQALevel03(questionType, level01, level02)
    c.String(http.StatusOK, string(retData))
  })

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

  r.GET("/api/v1/history/choice-qa", func(c *gin.Context) {
    user := c.Query("user")
    dataType := c.Query("type")
    level01 := c.Query("level01")
    level02 := c.Query("level02")
    level03 := c.Query("level03")

    switch dataType {
      case "new":
        retData := fetchHistoryChoiceNew(&user, &level01, &level02, &level03)
        c.String(http.StatusOK, string(retData))
      case "failure":
        retData := fetchHistoryChoiceFailure(&user, &level01, &level02, &level03)
        c.String(http.StatusOK, string(retData))
      default:
        fmt.Printf("Unsupported type: %s \n", dataType)
    }
  })

  r.POST("/api/v1/history/choice-qa", func(c *gin.Context) {
    byteData, err := io.ReadAll(c.Request.Body)
    if err != nil {
        // Handle error
    }
    fmt.Printf("The json Data: %#v \n", string(byteData) )

    var jsonData PostSciencePictorialPlant
    json.Unmarshal(byteData, &jsonData)
    fmt.Printf("Json parsed data: %#v \n", jsonData)

    err = postHistoryChoiceQA(jsonData)
    if err != nil {
      c.String(http.StatusOK, "Failure")
    } else {
      c.String(http.StatusOK, "Successful")
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

  r.GET("/api/v1/fill-in-blank", func(c *gin.Context) {
    user := c.Query("user")
    dataType := c.Query("type")
    level01 := c.Query("level01")
    level02 := c.Query("level02")
    level03 := c.Query("level03")


    switch dataType {
      case "new":
        retData := fetchFillInBlankQANew(&user, &level01, &level02, &level03)
        c.String(http.StatusOK, string(retData))
      case "failure":
        retData := fetchFillInBlankQAFailure(&user, &level01, &level02, &level03)
        c.String(http.StatusOK, string(retData))
      default:
        fmt.Printf("Unsupported type: %s \n", dataType)
    }
  })

  r.POST("/api/v1/fill-in-blank", func(c *gin.Context) {
    byteData, err := io.ReadAll(c.Request.Body)
    if err != nil {
        // Handle error
    }
    fmt.Printf("The json Data: %#v \n", string(byteData) )

    var jsonData PostFillInBlankQA 
    json.Unmarshal(byteData, &jsonData)
    fmt.Printf("Json parsed data: %#v \n", jsonData)

    err = postFillInBlankQA(jsonData)
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

func fetchChoiceQALevel02(questionType, level01 string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrLevel02 []string

  rows , err := db.Query(fmt.Sprintf("select distinct level02 from question_category where question_type = '%s' and level01 = '%s'", questionType, level01))
  checkErr(err)
  for rows.Next() {
    var level02 string
    err = rows.Scan(&level02)
    checkErr(err)
    arrLevel02 = append(arrLevel02, level02)
  }

  fmt.Printf("%#v", arrLevel02)
  bytesInfo, err := json.Marshal(arrLevel02)
  if err != nil {
    panic(err)
  }
  fmt.Printf("%#v", bytesInfo)
  db.Close()
  return bytesInfo
}

func fetchChoiceQALevel03(questionType, level01, level02 string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrLevel03 []string

  rows , err := db.Query(fmt.Sprintf("select distinct level03 from question_category where question_type = '%s' and level01 = '%s' and level02='%s'", questionType, level01, level02))
  checkErr(err)
  for rows.Next() {
    var level03 string
    err = rows.Scan(&level03)
    checkErr(err)
    arrLevel03 = append(arrLevel03, level03)
  }

  fmt.Printf("%#v", arrLevel03)
  bytesInfo, err := json.Marshal(arrLevel03)
  if err != nil {
    panic(err)
  }
  fmt.Printf("%#v", bytesInfo)
  db.Close()
  return bytesInfo
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
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t3.* from science_choice_qa_test t1 inner join science_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id right join science_choice_qa t3 on t2.question_id = t3.sequence where t2.question_id is null order by t3.sequence limit 10`, *user))
}

func fetchSciencePictorialPlantFailure(user *string) []byte {
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t2.* from (select rank() over (partition by t2.question_id order by t1.create_at desc) as rank , t2.question_id, t1.create_at, t2.is_correct from science_choice_qa_test t1 inner join science_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id ) t1 inner join science_choice_qa t2 on t1.rank = 1 and t1.is_correct = 0 and t2.sequence = t1.question_id limit 10`, *user))
}

func fetchHistoryChoiceNew(user, level01, level02, level03 *string) []byte {
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t3.* from general_choice_qa_test t1 inner join general_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id right join general_choice_qa t3 on t2.question_id = t3.sequence inner join v_choice_qa_category t4 on t4.sequence = t3.category and t4.level01 = '%s' and t4.level02 = '%s' and t4.level03 = '%s'  where t2.question_id is null order by t3.sequence limit 10`, *user, *level01, *level02, *level03))
}

func fetchHistoryChoiceFailure(user, level01, level02, level03 *string) []byte {
   return fetchSciencePictorialPlant(fmt.Sprintf(`select t2.* from (select rank() over (partition by t2.question_id order by t1.create_at desc) as rank , t2.question_id, t1.create_at, t2.is_correct from general_choice_qa_test t1 inner join general_choice_qa_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id ) t1 inner join general_choice_qa t2 on t1.rank = 1 and t1.is_correct = 0 and t2.sequence = t1.question_id inner join v_choice_qa_category t4 on t4.sequence = t2.category and t4.level01 = '%s' and t4.level02 = '%s' and t4.level03  = '%s' limit 10`, *user, *level01, *level02, *level03))
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

func postFillInBlankQA(reqData PostFillInBlankQA) error  {

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

  queryString := "insert into qa_fill_in_question_test(userAccount) values (?)"

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

  queryString = "insert into qa_fill_in_question_hist(test_id, sequence, question_id, answer, is_correct, time_taken) values (?, ?, ?, ?, ?, ?)"

  for idx, row := range reqData.FillInBlankQA {
    var isCorrect bool
    if row.Answer == row.Response {
      isCorrect = true
    }else {
      isCorrect = false
    }

    _, err := tx.Exec(queryString, testId, idx, row.Sequence, row.Response, isCorrect, 0)

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

func postHistoryChoiceQA(reqData PostSciencePictorialPlant) error  {

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

  queryString := "insert into general_choice_qa_test(userAccount) values (?)"

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

  queryString = "insert into general_choice_qa_hist(test_id, sequence, question_id, answer, is_correct, time_taken) values (?, ?, ?, ?, ?, ?)"
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

type MenuRow struct {
    Sequence        int       `json:"-"`
    ParentMenuId    int       `json:"-"`
    Path            string    `json:"path"`
    Name            string    `json:"name"`
    Component       string    `json:"component,omitempty"`
    ComponentParams map[string]string    `json:"params,omitempty"`
    Children        []MenuRow `json:"routes,omitempty"`
}

func fetchMenu(user string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrData []MenuRow
//  mapData := make(map[int]MenuRow)

  rows, err := db.Query("select sequence, parent_menu_id, path, name, coalesce(component, '') as component, coalesce(component_params, '') as component_params from menu_master order by sequence") 

  checkErr(err)
  for rows.Next() {
    var row MenuRow
    var componentParams string

    err = rows.Scan(&row.Sequence, &row.ParentMenuId, &row.Path, &row.Name, &row.Component, &componentParams)
    checkErr(err)
    fmt.Printf("The row: %#v \n", row)

    fmt.Printf("before parsed component params : %#v \n", componentParams)
    json.Unmarshal([]byte(componentParams), &row.ComponentParams)
    fmt.Printf("After parsed data: %#v \n", row.ComponentParams)

    pushedFlg := pushMenuRow(row, &arrData) 
    if pushedFlg == false {
      row.Path = fmt.Sprintf("/%s", row.Path)
      arrData = append(arrData, row)
    }
    fmt.Printf("after pushed data: %#v \n\n", arrData)
  }

  fmt.Printf("Final result: %#v \n", arrData)
  bytesData, err := json.Marshal(arrData)
  if err != nil {
    panic(err)
  }

//  bytesData, err := json.Marshal(arrData)
//  if err != nil {
//    panic(err)
//  }
  db.Close()
  return bytesData
}

func pushMenuRow(menuRow MenuRow, arrData *[]MenuRow) bool {
//  for _, row := range *arrData {
  for idx:=0; idx < len((*arrData)); idx++{
    fmt.Printf(" ---- %d -> %d \n", menuRow.ParentMenuId, (*arrData)[idx].Sequence)
    if menuRow.ParentMenuId == (*arrData)[idx].Sequence {
      menuRow.Path = fmt.Sprintf("%s/%s", (*arrData)[idx].Path, menuRow.Path)
      (*arrData)[idx].Children = append((*arrData)[idx].Children, menuRow)
      return true
    } else {
      ret := pushMenuRow(menuRow, &((*arrData)[idx].Children))
      if ret == true {
        return true
      }
    }
  }

  return false
}

type FillInBlankQA struct {
  Sequence  int    `json:"sequence"`
  Question  string `json:"question"`
  Answer    string `json:"answer"`

  Response  string `json:"response"`
  IsCorrect int    `json:"is_correct"`
  TimeTaken int    `json:"int"`
  FixAnswer string `json:"fix_answer"`
  NeedCheck string `json:"need_check"`
}

type PostFillInBlankQA struct {
    User          string          `json:"user"`
    FillInBlankQA []FillInBlankQA `json:"data"`
}

func fetchFillInBlankQANew(user, level01, level02, level03 *string) []byte {
  query := fmt.Sprintf(`select t3.sequence, t3.question, t3.answer from qa_fill_in_question_test t1 inner join qa_fill_in_question_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id right join qa_fill_in_question t3 on t2.question_id = t3.sequence inner join question_category t4 on t4.sequence = t3.category and question_type = 'fill-in-blank' and t4.level01 = '%s' and t4.level02 = '%s' and t4.level03 = '%s'  where t2.question_id is null order by t3.sequence limit 3`, *user, *level01, *level02, *level03)
  return fetchFillInBlankQA(&query)
}

func fetchFillInBlankQAFailure(user, level01, level02, level03 *string) []byte {
  query := fmt.Sprintf(`select t2.sequence, t2.question, t2.answer from (select rank() over (partition by t2.question_id order by t1.create_at desc) as rank , t2.question_id, t1.create_at, t2.is_correct from qa_fill_in_question_test t1 inner join qa_fill_in_question_hist t2 on t1.userAccount = '%s' and t1.id = t2.test_id ) t1 inner join qa_fill_in_question t2 on t1.rank = 1 and t1.is_correct = 0 and t2.sequence = t1.question_id inner join question_category t4 on t4.sequence = t2.category and t4.question_type = 'fill-in-blank' and t4.level01 = '%s' and t4.level02 = '%s' and t4.level03  = '%s' limit 10`, *user, *level01, *level02, *level03)

  return fetchFillInBlankQA(&query)
}

func fetchFillInBlankQA(query *string) []byte {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var fillInBlankQAs []FillInBlankQA

  rows , err := db.Query(*query)

  checkErr(err)
  for rows.Next() {
    var qa FillInBlankQA
    err = rows.Scan(&qa.Sequence, &qa.Question, &qa.Answer)
    checkErr(err)
    fillInBlankQAs = append(fillInBlankQAs, qa)
  }

  bytesWords, err := json.Marshal(fillInBlankQAs)
  if err != nil {
    panic(err)
  }
  db.Close()
  return bytesWords
}
