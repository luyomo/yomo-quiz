package main

import (
  // "net/http"
  "time"
  "fmt"
  "os"
  //"encoding/json"
//  "encoding/gob"
//  "bytes"
  //"io/ioutil"
  "strings"
  //"net/http"
  // "io"
  // "encoding/json"

  g "github.com/serpapi/google-search-results-golang"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
)

func main() {

    // Fetch Json data from serpapi

    serp_api := os.Getenv("SERP_API_KEY")
    if serp_api == "" {
      fmt.Println("Please fill in the valid serp api key")
      return 
    }

    urlData, err := fetchSciencePic()
    if err != nil {
      panic(err)
    }

    for _, qa := range urlData {
      fmt.Printf("---------- data from db: %#v \n", qa)

      parameter := map[string]string{
        "engine": "google_images",
        "q": qa.Question,
        "location": "Japan",
      }

      search := g.NewGoogleSearch(parameter, serp_api)
      results, err := search.GetJSON()
      if err != nil {
        panic(err)
      }


      // requestURL := fmt.Sprintf("https://serpapi.com/search?engine=google_images&q=%s&api_key=%s", qa.Question, serp_api)
      // fmt.Printf("url: %s \n", requestURL)
      // res, err := http.Get(requestURL)
      // if err != nil {
      //   fmt.Printf("error making http request: %s\n", err)
      //   os.Exit(1)
      // }

      // fmt.Printf("client: status code: %d\n", res.StatusCode)

      // resBody, err := ioutil.ReadAll(res.Body)
      // if err != nil {
      //     fmt.Printf("client: could not read response body: %s\n", err)
      //     os.Exit(1)
      // }


//      dat, err := os.ReadFile("serpapi.json")
//      checkErr(err)
      arrUrls := parseJson2Urls(results)
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


func parseJson2Urls(jsonData g.SearchResult) []string {
  var arrUrls []string
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
