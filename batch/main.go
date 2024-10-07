package main

import (
  // "net/http"
  "time"
  "fmt"
  "os"
  "encoding/json"
//  "encoding/gob"
//  "bytes"
  "strings"
  // "io"
  // "encoding/json"

  "database/sql"
  _ "github.com/go-sql-driver/mysql"
)

func main() {

    // Fetch Json data from serpapi

    urlData, err := fetchSciencePic()
    if err != nil {
      panic(err)
    }

    for _, qa := range urlData {
      fmt.Printf("---------- data from db: %#v \n", qa)

      dat, err := os.ReadFile("serpapi.json")
      checkErr(err)
      arrUrls := parseJson2Urls(dat)
      fmt.Printf("The urls: %#v \n", arrUrls)

      updatePictorialUrl(qa.Sequence, arrUrls)
    }
} 

type SciencePic struct {
  Sequence int    `json:"sequence"`
  Question string `json:"question"`
  Category string `json:"category"`
  Urls     string `json:"urls"`
}

func checkErr(err error) {
    if err != nil {
        panic(err)
    }
}


func parseJson2Urls(byteData []byte) []string {
  var arrUrls []string
  var jsonData map[string]interface{}

  if err := json.Unmarshal(byteData, &jsonData); err != nil {
    fmt.Println(err)
  }
//  fmt.Printf("json data: %#v \n", jsonData["images_results"])
  imagesRes := jsonData["images_results"].([]interface{})
  for _, entry := range imagesRes {
    image := entry.(map[string]interface{})
    arrUrls  = append(arrUrls , image["original"].(string))
    fmt.Printf("The image: %#v \n ", image["original"])
  }
  return arrUrls
}

func fetchSciencePic() ([]SciencePic, error) {
  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  var arrData []SciencePic 

  rows, err := db.Query("select sequence, question, category from science_pictorial_qa where urls is null") 

  checkErr(err)
  for rows.Next() {
    var row SciencePic

    err = rows.Scan(&row.Sequence, &row.Question, &row.Category )
    checkErr(err)
    fmt.Printf("data: %#v \n", row)


    arrData = append(arrData, row)
  }

  db.Close()

  return arrData, nil
}

func updatePictorialUrl(seq int, data []string) error  {

  db, err := sql.Open("mysql", "yomoenuser:yomoenuser@tcp(192.168.1.105:3306)/yomoen")
  if err != nil {
    panic(err)
  }
  // See "Important settings" section.
  db.SetConnMaxLifetime(time.Minute * 3)
  db.SetMaxOpenConns(10)
  db.SetMaxIdleConns(10)

  defer db.Close()

  strData := fmt.Sprintf("[\"%s\"]", strings.Join(data, "\",\""))
  fmt.Printf("string data: %s \n", strData)
//  buf := &bytes.Buffer{}
//  gob.NewEncoder(buf).Encode(data)
//  bs := buf.Bytes()
//  fmt.Printf("------> %q", bs)

  tx, err := db.Begin()

  queryString := "update science_pictorial_qa set urls = ? where sequence = ?"

  _, err = tx.Exec(queryString, strData , seq)

  if err != nil {
     fmt.Printf("Failed to update data: %#v \n", err)
     tx.Rollback()
     return err
  }

  tx.Commit()
  return nil
}
