(function () {
  $(function () {
    //  in your allowance i used /coins and not /coins/list
    const DOMAIN = "https://api.coingecko.com/api/v3/coins";
    let moneyObjectArray = [];
    let moreInfoMap = new Map();
    let arrayOfToggledCoins = [];
    let modalToggledArray = [];

    let graphInterval;

    // onload check if the coins are saved in an array and display the coins
    checkIfCoinsInsideAnArray();
    // get the coins from the api
    function getTheCoinsFromApi() {
      $.get(DOMAIN)
        .then(function (theCoinsFromTheApi) {
          // display the coins on the ui after the get requset
          displayTheCoinsOnUi(theCoinsFromTheApi);

          moneyObjectArray = theCoinsFromTheApi;
          // console.log(moneyObjectArray);
          return moneyObjectArray;
        })
        .catch((error) => alert("error loading the page"));
    }
    // the function the checked if are inside an array
    function checkIfCoinsInsideAnArray() {
      if (moneyObjectArray.length > 0) {
        let data = moneyObjectArray;
        displayTheCoinsOnUi(data);
      } else {
        // if not saved go get it from the api
        getTheCoinsFromApi();
      }
    }
    //  display all the coins on the ui
    function displayTheCoinsOnUi(theCoinsFromTheApi) {
      let coinObjectCounter = 0;
      // loop to display all the cards
      for (let coinObject of theCoinsFromTheApi) {
        if (coinObjectCounter == theCoinsFromTheApi.length - 1) {
          $("#loader").hide();
          return;
        }
        let newDiv = $("<div>");
        newDiv.addClass("card ");
        newDiv.css("width", "18rem");
        newDiv.addClass("justify-content-center");
        $("#cardsDiv").append(newDiv);

        let cardBody = $("<div>");
        cardBody.addClass("card-body");
        newDiv.append(cardBody);

        let title = $("<h5>");
        title.addClass("card-title");
        title.html(coinObject.symbol.toUpperCase());
        title.css("font-weight", "bolder");
        cardBody.append(title);

        let checkBoxLabel = $("<label>");
        checkBoxLabel.addClass("switch");
        title.append(checkBoxLabel);

        let checkBoxInput = $("<input>");
        checkBoxInput.attr("id", "id" + coinObject.id);
        checkBoxInput.attr("type", "checkbox");
        checkBoxLabel.append(checkBoxInput);

        let checkBoxSpan = $("<span>");
        checkBoxSpan.addClass("slider round");
        checkBoxLabel.append(checkBoxSpan);

        let text = $("<p>");
        text.addClass("card-text");
        text.html(coinObject.name);
        cardBody.append(text);

        let button = $("<button>");
        button.addClass("btn btn-primary");
        button.attr("id", coinObject.id);
        button.addClass("btn btn-primary btn-warning button");
        button.attr("type", "button");
        button.attr("data-toggle", "collapse");
        button.attr("data-target", "#button" + coinObject.id);
        button.html("more info");
        cardBody.append(button);

        let moreInfoContent = $("<div>");
        moreInfoContent.addClass("collapse infoContent");
        moreInfoContent.attr("id", "button" + coinObject.id);
        cardBody.append(moreInfoContent);

        coinObjectCounter++;
        // on click get the more info about the card

        button.click(function (event) {
          // get more info from the url and display it or check if the info is saved and display it
          getMoreInfoFromUrl(event.target.id, moreInfoContent);
        });
        // on change in the checkbox input check if it checked or not
        checkBoxInput.change(function (event) {
          if ($(event.target).is(":checked")) {
            // if the button is checked save it to the array of saved coins
            savesTheCheckedCoins(event.target.id);
          } else {
            // if the input is not checked remove it from the array
            deleteFromCoinArray(event.target.id);
          }
        });
      }
    }
    // showing the searchTheCoinInTheArray result on the ui

    function showTheSearchResult(searchArray) {
      for (let coinObject of searchArray) {
        let newDiv = $("<div>");
        newDiv.addClass("card ");
        newDiv.css("width", "18rem");
        $("#cardsDiv").append(newDiv);

        let cardBody = $("<div>");
        cardBody.addClass("card-body");
        newDiv.append(cardBody);

        let title = $("<h5>");
        title.addClass("card-title");
        title.html(coinObject.symbol.toUpperCase());
        title.css("font-weight", "bolder");
        cardBody.append(title);

        let text = $("<p>");
        text.addClass("card-text");
        text.html(coinObject.name);
        cardBody.append(text);

        let checkBoxLabel = $("<label>");
        checkBoxLabel.addClass("switch");
        title.append(checkBoxLabel);

        let checkBoxInput = $("<input>");
        checkBoxInput.attr("id", "id" + coinObject.id);
        checkIfSearchResultIsToggled(coinObject.id, checkBoxInput);
        checkBoxInput.attr("type", "checkbox");
        checkBoxLabel.append(checkBoxInput);

        let checkBoxSpan = $("<span>");
        checkBoxSpan.addClass("slider round");
        checkBoxLabel.append(checkBoxSpan);

        let button = $("<button>");
        button.addClass("btn btn-primary");
        button.attr("id", coinObject.id);
        button.addClass("btn btn-primary btn-warning button");
        button.attr("type", "button");
        button.attr("data-toggle", "collapse");
        button.attr("data-target", "#button" + coinObject.id);
        button.html("more info");
        cardBody.append(button);

        let moreInfoContent = $("<div>");
        moreInfoContent.addClass("collapse infoContent");
        moreInfoContent.attr("id", "button" + coinObject.id);
        cardBody.append(moreInfoContent);

        // on more info click get the info
        button.click(function (event) {
          console.log(event.target.id);
          getMoreInfoFromUrl(event.target.id, moreInfoContent);
        });
        // if there is a change in the checkbox
        checkBoxInput.change(function (event) {
          // if checkbox is checked save the coin
          if ($(event.target).is(":checked")) {
            savesTheCheckedCoins(event.target.id);
          } else {
            // if the checkbox is unchecked then delete it from the array
            deleteFromCoinArray(event.target.id);
          }
        });
      }
    }
    // check if the searched coin is toggled then display it
    function checkIfSearchResultIsToggled(id, checkBoxInput) {
      checkIfInsideAnArray = arrayOfToggledCoins.filter(function (element) {
        return element.id == id;
      });
      if (checkIfInsideAnArray == false) {
        return;
      } else {
        checkBoxInput.attr("checked", true);
      }
    }

    // click on about to show the about page
    $("#about").click(function () {
      $("#cardsDiv").empty();
      $("#chartContainer").hide();
      $("body").addClass("aboutBody");
      creatTheAboutPage();
    });
    // creating the about page to show
    function creatTheAboutPage() {
      let aboutMeDiv = $("<div>");
      aboutMeDiv.addClass("aboutus-section");
      $("#cardsDiv").append(aboutMeDiv);

      let containerDiv = $("<div>");
      containerDiv.addClass("container");
      aboutMeDiv.append(containerDiv);

      let rowDiv = $("<div>");
      rowDiv.addClass("row");
      containerDiv.append(rowDiv);

      let collumDiv = $("<div>");
      collumDiv.addClass("col-md-3 col-sm-6 col-xs-12");
      rowDiv.append(collumDiv);

      let textDiv = $("<div>");
      textDiv.addClass("aboutus");
      collumDiv.append(textDiv);

      let aboutMeH2 = $("<aboutMeH2>");
      aboutMeH2.addClass("aboutus-title");
      aboutMeH2.append("About Me");
      aboutMeH2.css("margin-bottom", "20px");
      textDiv.append(aboutMeH2);

      let aboutMeParagraph = $("<p>");
      aboutMeParagraph.addClass("aboutus-text");
      aboutMeParagraph.append(
        "<br>" +
          "Born : 1998" +
          "<br>" +
          "Gender : male " +
          "<br>" +
          " School : high school 'h' " +
          "<br>" +
          " Work : writ of execution" +
          "<br>" +
          "I was born in ashdod in 1998 and grow up in ashdod also went to school in 2005 after that went to the high school in 2010." +
          "<br>" +
          " Studied there 6 more years till graduation in 2016." +
          "<br>" +
          "After that went to the army in november 2016 and served in geffen bridage for 2.8 years." +
          "<br>" +
          "After the army went to thailand with my wife in the summer of 2019." +
          "<br>" +
          "Thanks for reading " +
          "<br>" +
          "Have a nice day Avi Edri "
      );
      textDiv.append(aboutMeParagraph);

      let aboutTheProjectH2 = $("<aboutMeH2>");
      aboutTheProjectH2.addClass("aboutus-title");
      aboutTheProjectH2.append("my jquery project");
      textDiv.append(aboutTheProjectH2);

      let aboutTheProject = $("<p>");
      aboutTheProject.addClass("aboutus-text");
      aboutTheProject.append(
        "<br>" +
          " The project is about digital coins and to show the value of them in real time and to show the value in real time" +
          "<br>" +
          " You can click on more info to get to know the value in the market in real time ." +
          "<br>" +
          " or you can toggle them and see the changes in the currencies "
      );
      textDiv.append(aboutTheProject);
      let secondCollumDiv = $("<div>");
      secondCollumDiv.addClass("col-md-3 col-sm-6 col-xs-12");
      rowDiv.append(secondCollumDiv);

      let imageDiv = $("<div>");
      imageDiv.addClass("aboutus-banner");
      secondCollumDiv.append(imageDiv);

      let aboutMeImage = $("<img>");
      aboutMeImage.attr(
        "src",
        "http://themeinnovation.com/demo2/html/build-up/img/home1/about1.jpg"
      );
      imageDiv.append(aboutMeImage);
    }

    // after clicking on the home button load the home screen
    $("#homeButton").click(function () {
      $("#cardsDiv").empty();
      $("#chartContainer").hide();
      $("body").removeClass("aboutBody");
      checkIfCoinsInsideAnArray();
      afterHomeReturnToggleCoins();
    });
    // after a click on the search Button run a function to display the search result
    $("#searchButton").click(function () {
      let searchInput = $("#searhInput");
      let searchText = searchInput.val();
      searchText = $.trim(searchText);
      if (searchText.length == 0) {
        alert("you didnt write anything please write something");
        return;
      }
      $("#cardsDiv").empty();
      searchTheCoinInTheArray(searchInput, searchText);
    });

    // function for searching the coin in the array
    function searchTheCoinInTheArray() {
      let searchInput = $("#searhInput");
      let searchText = searchInput.val().toLowerCase();
      searchText = $.trim(searchText);
      searchInput.val("");

      let myObjectArraySearch = moneyObjectArray;
      let searchArray = myObjectArraySearch.filter(function (element) {
        return element.symbol == searchText;
      });
      //  if you the searched a coin that dosen't exist load the home page
      if (searchArray == 0) {
        alert(
          "didn't find any coins please try again with a valid coin symbol"
        );
        $("#cardsDiv").empty();
        // toggle all the coins toggled
        checkIfCoinsInsideAnArray();
        // load the home page on ui
        afterHomeReturnToggleCoins();
      }
      // show the searched coin on the ui
      showTheSearchResult(searchArray);
    }
    // after a click on the graph button run a function to display the function on the  ui
    $("#graphButton").click(function () {
      if (arrayOfToggledCoins.length != 0) {
        $("body").removeClass("aboutBody");
        $("#searhInput").val("");
        $("#cardsDiv").empty();
        $("#chartContainer").show();

        let loader = $("<div>");
        loader.addClass("loader");
        loader.attr("id", "loader");
        $("#container").append(loader);

        let urlForGraph =
          "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
        let urlForGraphEnding = "&tsyms=USD";
        // clear the interval
        clearTheInterval(graphInterval);

        let coinsStrings = "";
        let optionsForGraph = creatingOptionsForGraph();
        optionsForGraph.data = [];

        let coinsStringsWithoutComma = updateTheCoinString(coinsStrings);

        showingTheGraphOnUi(
          urlForGraph,
          urlForGraphEnding,
          coinsStringsWithoutComma,
          optionsForGraph
        );
      } else {
        alert(
          "you cant show graph without toggling buttons please toggle any button " +
            "and try again "
        );
      }
    });
    // options to show on the graph
    function creatingOptionsForGraph() {
      let options = {
        // exportEnabled: true,
        animationEnabled: false,
        title: {
          text: "",
        },
        subtitles: [
          {
            text: "Click Legend to Hide or Unhide Data Series",
          },
        ],
        axisX: {
          title: new Date(),
        },
        axisY: {
          title: "Price in USD",
          titleFontColor: "#4F81BC",
          lineColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          tickColor: "#4F81BC",
          includeZero: false,
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: "pointer",
          itemclick: toggleDataSeries,
        },
        data: [],
      };
      return options;
    }
    // remove the last comma from the get url address
    function updateTheCoinString(coinsStrings) {
      for (i = 0; i < arrayOfToggledCoins.length; i++) {
        coinsStrings =
          coinsStrings + arrayOfToggledCoins[i].symbol.toUpperCase() + ",";
      }

      let coinsStringsWithoutTheLastComma = coinsStrings.slice(
        0,
        coinsStrings.length - 1
      );
      return coinsStringsWithoutTheLastComma;
    }

    // displaying the graph on the ui
    function showingTheGraphOnUi(
      urlForGraph,
      urlForGraphEnding,
      coinsStringsWithoutComma,
      optionsForGraph
    ) {
      // url for the get request
      urlForGraphInfoDownload =
        urlForGraph + coinsStringsWithoutComma + urlForGraphEnding;

      let chartContainer = $("<div>");
      chartContainer.attr("id", "chartContainer");
      $("#container").append(chartContainer);
      // function to create the graph
      createTheGraphObject(
        coinsStringsWithoutComma,
        urlForGraphInfoDownload,
        optionsForGraph
      );
      // the interval to get new data every 2 seconds
      graphInterval = graphInterval = setInterval(function () {
        updateDataPoints(urlForGraphInfoDownload, optionsForGraph);
      }, 2000);
    }
    // creating the graph with data points
    function createTheGraphObject(
      coinsStringsWithoutComma,
      urlForGraphInfoDownload,
      optionsForGraph
    ) {
      optionsForGraph.title.text = coinsStringsWithoutComma;
      jQuery
        .get(urlForGraphInfoDownload)
        .then(function (coinDataFromUrl) {
          $(".loader").remove();
          for (let [key, value] of Object.entries(coinDataFromUrl)) {
            let dataObject = {
              type: "spline",
              name: key,
              showInLegend: true,
              xValueFormatString: "MMM YYYY",
              yValueFormatString: "#,##0 USD",
              dataPoints: [
                {
                  x: new Date(),
                  y: value.USD,
                },
              ],
            };
            optionsForGraph.data.push(dataObject);
          }
          jQuery("#chartContainer").CanvasJSChart(optionsForGraph);
        })
        .catch((error) => alert("error 404 not found"));
    }
    // render the graph
    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
    // every 2 seconds update the graph with new data
    function updateDataPoints(URLforGraphInfoDownload, optionsForGraph) {
      jQuery
        .get(URLforGraphInfoDownload)
        .then(function (coinsData) {
          for (let [key, value] of Object.entries(coinsData)) {
            for (let index = 0; index < optionsForGraph.data.length; index++) {
              if (optionsForGraph.data[index].name == key) {
                let dataPoints = {
                  x: new Date(),
                  y: value.USD,
                };
                optionsForGraph.data[index].dataPoints.push(dataPoints);
              }
            }
          }
          jQuery("#chartContainer").CanvasJSChart(optionsForGraph);
        })
        .catch((error) => alert("error 404 not found"));
    }

    // A function the renders the chart
    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
    //  clear the interval
    function clearTheInterval(graphInterval) {
      clearInterval(graphInterval);
    }
    // function for getting the data about the coin from the url or if saved from the map
    function getMoreInfoFromUrl(id, moreInfoContent) {
      // clear the more info after the click
      moreInfoContent.empty();
      // create the loader
      let loader = $("<div>");
      loader.addClass("loader");
      moreInfoContent.append(loader);

      coinApi = "https://api.coingecko.com/api/v3/coins/" + id;

      if (moreInfoMap.has(id)) {
        // if the info is saved in the cache empty the loader
        moreInfoContent.empty();
        let coinArray = moreInfoMap.get(id);
        let image = $("<img>");
        image.addClass("coinIcon");
        image.css("margin-left", "27px");
        image.attr("src", coinArray.image.small);
        moreInfoContent.addClass("moreInfo");
        moreInfoContent.attr("src", coinArray.image.small);
        if (coinArray.market_data.current_price.ils == undefined) {
          moreInfoContent.append("ILS :  no info to show " + "<br>");
        } else {
          moreInfoContent.append(
            "ILS : ₪    " + coinArray.market_data.current_price.ils + "<br>"
          );
        }
        if (coinArray.market_data.current_price.usd == undefined) {
          moreInfoContent.append("USD : no info to show " + "<br>");
        } else {
          moreInfoContent.append(
            "USD : $    " + coinArray.market_data.current_price.usd + "<br>"
          );
        }
        if (coinArray.market_data.current_price.eur == undefined) {
          moreInfoContent.append("EUR : no info to show " + "<br>");
        } else {
          moreInfoContent.append(
            "EUR : €    " + coinArray.market_data.current_price.eur
          );
        }

        moreInfoContent.append(image);
      } else {
        jQuery.get(coinApi).then(function (moreInfoFromUrl) {
          // saving the info inside the map
          moreInfoMap.set(id, moreInfoFromUrl);

          setTimeout(function () {
            moreInfoMap.delete(id);
          }, 120000);

          moreInfoContent.empty();

          let image = $("<img>");
          image.addClass("coinIcon");
          image.css("margin-left", "27px");
          image.attr("src", moreInfoFromUrl.image.small);

          moreInfoContent.addClass("moreInfo");
          if (moreInfoFromUrl.market_data.current_price.ils == undefined) {
            moreInfoContent.append("ILS :  no info to show " + "<br>");
          } else {
            moreInfoContent.append(
              "ILS : ₪    " +
                moreInfoFromUrl.market_data.current_price.ils +
                "<br>"
            );
          }
          if (moreInfoFromUrl.market_data.current_price.usd == undefined) {
            moreInfoContent.append("USD :  no info to show" + "<br>");
          } else {
            moreInfoContent.append(
              "USD : $    " +
                moreInfoFromUrl.market_data.current_price.usd +
                "<br>"
            );
          }
          if (moreInfoFromUrl.market_data.current_price.eur == undefined) {
            moreInfoContent.append("EUR : no info to show " + "<br>");
          } else {
            moreInfoContent.append(
              "EUR : €    " + moreInfoFromUrl.market_data.current_price.eur
            );
          }
          moreInfoContent.append(image);
        });
      }
    }

    // loading the modal after reaching the limit
    function callModal(arrayOfToggledCoins, id) {
      let lastToggledCoin;
      lastToggledCoin = arrayOfToggledCoins[5];
      let modalHeader = $("#exampleModalLabel");
      let modalBody = $("#modalBody");
      jQuery.noConflict();
      $("#exampleModal").modal("show");
      modalHeader.empty();
      modalHeader.append(
        "you can choose only 5 coins please delete if you want other coins.  <br>" +
          "the last coin you chose was : " +
          arrayOfToggledCoins[5].symbol
      );

      $("#modalBody").empty();

      for (i = 0; i < arrayOfToggledCoins.length - 1; i++) {
        let newToggledDiv = $("<div>");
        newToggledDiv.addClass("card w-75");
        newToggledDiv.css("text-align", "left");
        modalBody.append(newToggledDiv);

        let modalCardBody = $("<div>");
        modalCardBody.addClass("card-body");
        modalCardBody.css("padding", "0px");
        modalCardBody.css("margin-left", "20px");
        modalBody.append(modalCardBody);

        let modalTitle = $("<h5>");
        modalTitle.addClass("card-title");
        modalTitle.html(arrayOfToggledCoins[i].symbol.toUpperCase());
        modalTitle.css("font-weight", "bolder");
        modalCardBody.append(modalTitle);

        let modalCheckBoxLabel = $("<label>");
        modalCheckBoxLabel.addClass("switch");
        modalCheckBoxLabel.css("margin-right", "30px");
        modalCheckBoxLabel.css("margin-bottom", "20px");
        modalTitle.append(modalCheckBoxLabel);

        let modalCheckBoxInput = $("<input>");
        modalCheckBoxInput.attr("id", arrayOfToggledCoins[i].id);
        modalCheckBoxInput.attr("checked", true);
        modalCheckBoxInput.attr("type", "checkbox");
        modalCheckBoxLabel.append(modalCheckBoxInput);

        let modalCheckBoxSpan = $("<span>");
        modalCheckBoxSpan.addClass("slider round");
        modalCheckBoxLabel.append(modalCheckBoxSpan);

        modalCheckBoxInput.change(function (event) {
          if ($(event.target).is(":not(:checked)")) {
            deleteFromModalChanges(event.target.id);
          } else {
            saveTheModalChanges(event.target.id);
          }
        });
      }

      $("#saveButton").click(function () {
        $("#exampleModal").modal("hide");
        updateTheUiAfterModal(arrayOfToggledCoins, lastToggledCoin);
      });

      $("#closeButton").click(function () {
        updateTheUiAfterCloseClick(lastToggledCoin);
      });
    }

    // saving the toggled coins inside an array
    function savesTheCheckedCoins(id) {
      if (arrayOfToggledCoins.length >= 5) {
        modalToggledArray = arrayOfToggledCoins.slice(0, 5);
        let indexOfToggleCoin = toggleArraySearch.filter(function (element) {
          return "id" + element.id == id;
        });
        if (modalToggledArray.length >= 6) {
          arrayOfToggledCoins.splice(5, 1);
        }
        arrayOfToggledCoins.push(indexOfToggleCoin[0]);
        // display the modal
        callModal(arrayOfToggledCoins, id);
        return;
      }
      toggleArraySearch = moneyObjectArray;
      let indexOfToggleCoin = toggleArraySearch.filter(function (element) {
        return "id" + element.id == id;
      });

      arrayOfToggledCoins.push(indexOfToggleCoin[0]);
      return arrayOfToggledCoins;
    }

    // after uncheck delete from the array of toggled coins
    function deleteFromCoinArray(id) {
      for (let index = 0; index < arrayOfToggledCoins.length; index++) {
        let idAfterSlice = id.slice(2);
        if (idAfterSlice == arrayOfToggledCoins[index].id) {
          arrayOfToggledCoins.splice(index, 1);
          return arrayOfToggledCoins;
        }
      }
    }
    // deleting the coins from the array when in modal
    function deleteFromModalChanges(id) {
      for (let index = 0; index < arrayOfToggledCoins.length; index++) {
        if (id == arrayOfToggledCoins[index].id) {
          arrayOfToggledCoins.splice(index, 1);
          console.log(arrayOfToggledCoins);
          return arrayOfToggledCoins;
        }
      }
    }
    // adding coins to the array in the modal
    function saveTheModalChanges(id) {
      for (let index = 0; index < arrayOfToggledCoins.length; index++) {
        toggleArraySearch = moneyObjectArray;
        let indexOfToggleCoin = toggleArraySearch.filter(function (element) {
          return element.id == id;
        });
        arrayOfToggledCoins.push(indexOfToggleCoin[0]);
        return arrayOfToggledCoins;
      }
    }

    // updating the ui after the modal changes
    function updateTheUiAfterModal(lastToggledCoin) {
      // array of what was deleted
      let filteredArray = modalToggledArray.filter(
        (element) => !arrayOfToggledCoins.includes(element)
      );
      // array of what wasnt delete
      let notFilteredArray = modalToggledArray.filter((element) =>
        arrayOfToggledCoins.includes(element)
      );

      // if you didnt remove any button uncheck the last one
      if (filteredArray.length == 0) {
        $("#id" + lastToggledCoin[5].id).prop("checked", false);
        arrayOfToggledCoins = notFilteredArray;
        return;
      } else {
        // loop to uncheck all the coins after the modal
        for (let index = 0; index < filteredArray.length; index++) {
          $("#id" + filteredArray[index].id).prop("checked", false);
        }
        // loop to checkup all the toggle button in the ui after the modal
        for (let index = 0; index < notFilteredArray.length; index++) {
          $("#id" + notFilteredArray[index].id).prop("checked", true);
        }
      }
    }

    // updating the ui after the close click in modal
    function updateTheUiAfterCloseClick(lastToggledCoin) {
      $("#id" + lastToggledCoin.id).prop("checked", false);
      arrayOfToggledCoins = modalToggledArray;
    }
    // after the home return toggle all the coins who are toggled
    function afterHomeReturnToggleCoins() {
      // if none are checked dont do anything
      if (arrayOfToggledCoins.length == 0) {
        return;
      } else {
        // loop to prop all the toggled coins
        for (let index = 0; index < arrayOfToggledCoins.length; index++) {
          $("#id" + arrayOfToggledCoins[index].id).prop("checked", true);
        }
      }
    }
  });
})();
