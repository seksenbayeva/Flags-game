// Начало документа загружен и готов
$(document).ready(function() {
  let draggableObjects; //flags
  let dropPoints; //ponts
  const startButton = $("#start"); // переменная ссылка
  const result = $("#result");
  // выборка всех элементов, применяется метод, добавляет указанные классы
  const controls = $('.controls-container').addClass('animate__animated animate__fadeIn');


  const mainPage = $(".main-page");
  const containers = $(".container");
  const data = [
    "belgium", "italy", "brazil", "china", "cuba", "ecuador", "georgia", "germany", "hong-kong", "india", "iran",
    "kazakhstan", "norway", "sri-lanka", "russia", "sweden", "switzerland", "united-states", "uruguay", "wales"
  ];
  
    let deviceType = ""; // для хранения информации о типе устройства
    // начальные координаты X и Y
    let initialX = 0,
      initialY = 0;
    // для хранения ссылки на текущий элемент, который перетаскивается
    let currentElement = "";
    // должно ли происходить перемещение элемента
    let moveElement = false;
  
    //функция для определения типа устройства, событие касания (TouchEvent)
    const isTouchDevice = () => {
      try {
        //We try to create Touch Event (It would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
      } catch (e) { //для обработки ошибок
        deviceType = "mouse";
        return false;
      }
    };
  
    let count = 0; //для отслеживания количества успешно размещенных флагов
  
    //Random value from Array
    const randomValueGenerator = () => {
      return data[Math.floor(Math.random() * data.length)];
    };
  
    // для отображения элементов управления игрой, когда игра завершается или выиграна
    const stopGame = () => {
      $('.controls-container').removeClass("hide"); // Показываем контейнер с элементами игры
      $('#start').removeClass("hide"); // Показываем кнопку "Начать"
    };
        
  
    //Drag & Drop Functions запускается при начале перетаскивания элемента
    const dragStart = (e) => {
      if (isTouchDevice()) {
        // устанавливаются в текущие координаты
        initialX = e.originalEvent.touches[0].clientX;
        initialY = e.originalEvent.touches[0].clientY;
        //Start movement for touch
        moveElement = true;
        currentElement = $(e.target);
      } else {
        //For non touch devices 
        //устанавливается текстовый тип данных и значение 
        e.originalEvent.dataTransfer.setData("text", e.target.id); 
      }
    };
  
    // в событии перетаскивания элемента над областью
    const dragOver = (e) => {
      e.preventDefault(); // позволить элементу быть целью для бросания
    };
  
    //для сенсорного экрана
    const touchMove = (e) => {
      if (moveElement) {
        e.preventDefault();
        let newX = e.originalEvent.touches[0].clientX;
        let newY = e.originalEvent.touches[0].clientY;
        // идентификатор элемента, который был касание или перетаскивание
        let currentSelectedElement = $("#" + e.target.id); 
        //изменяют позицию элемента, который перетаскивается, на сенсорном экране
        currentSelectedElement.parent().css("top", parseInt(currentSelectedElement.parent().css("top")) - (initialY - newY) + "px");
        currentSelectedElement.parent().css("left", parseInt(currentSelectedElement.parent().css("left")) - (initialX - newX) + "px");
        initialX = newX; //обновляют начальные координаты
        initialY = newY;
      }
    };
    //обрабатывает событие "бросания" элемента на целевую область
    const drop = (e) => {
      e.preventDefault();
      //For touch screen
      if (isTouchDevice()) {
        moveElement = false;
        //Select country name div using the custom attribute
        const currentDrop = $(`div[data-id='${e.target.id}']`);
        //Get boundaries of div
        const currentDropBound = currentDrop[0].getBoundingClientRect();
        //if the position of flag falls inside the bounds of the country name
        if (
          initialX >= currentDropBound.left &&
          initialX <= currentDropBound.right &&
          initialY >= currentDropBound.top &&
          initialY <= currentDropBound.bottom
        ) {
          currentDrop.addClass("dropped");
          //hide actual image
          currentElement.addClass("hide");
          currentDrop.html("");
          //Insert new img element
          currentDrop.prepend(`<img src="${currentElement.attr("id")}.png">`);
          count += 1;
        }
      } else {
        //Access data
        const draggedElementData = e.originalEvent.dataTransfer.getData("text");
        //Get custom attribute value
        const droppableElementData = $(e.target).attr("data-id");
        if (draggedElementData === droppableElementData) {
          const draggedElement = $("#" + draggedElementData);
          //dropped class
          $(e.target).addClass("dropped");
          //hide current img
          draggedElement.addClass("hide");
          //draggable set to false
          draggedElement.attr("draggable", "false");
          $(e.target).html("");
          //insert new img
          $(e.target).prepend(`<img src="${draggedElementData}.png">`);
          count += 1;
        }
      }
      //Win
      if (count == 3) {
        result.text("Победа!!");
        stopGame();
      }
    };
  
    //Creates flags and countries создание элементов в игровой области
    const creator = () => {
      // перебирает все контейнеры в игре и выполняет операции внутри для каждого контейнера
      containers.each(function() {
        // находят контейнеры для перетаскиваемых элементов
        const dragContainer = $(this).find(".draggable-objects");
        const dropContainer = $(this).find(".drop-points");
        // Очищают содержимое контейнеров 
        dragContainer.html("");
        dropContainer.html("");
        let randomData = [];
        //for string random values in array
        for (let i = 1; i <= 3; i++) {
          let randomValue = randomValueGenerator();
          if (!randomData.includes(randomValue)) {
            randomData.push(randomValue);
          } else {
            //If value already exists then decrement i by 1
            i -= 1;
          }
        }
        for (let i of randomData) {
          const flagDiv = $("<div>").addClass("draggable-image").attr("draggable", true);
          if (isTouchDevice()) {
            flagDiv.css("position", "absolute");
          }
          flagDiv.html(`<img src="${i}.png" id="${i}">`);
          dragContainer.append(flagDiv);
        }
        //Sort the array randomly before creating country divs
        // перемешивает порядок элементов в массиве
        randomData = randomData.sort(() => 0.5 - Math.random());
        // создаются целевые области для флагов
        for (let i of randomData) {
          const countryDiv = $("<div>").html(`<div class='countries' data-id='${i}'>
            ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
          </div>`);
          dropContainer.append(countryDiv);
        }
      });
    };
    
  
    //Start Game
    startButton.on("click", async function () {
      currentElement = "";
      controls.addClass("hide");
      startButton.addClass("hide");
      mainPage.addClass("hide");
      containers.removeClass("hide");
      await creator();
      count = 0;
      dropPoints = $(".countries");
      draggableObjects = $(".draggable-image");
  
      draggableObjects.on("dragstart", dragStart);
      draggableObjects.on("touchstart", dragStart);
      draggableObjects.on("touchend", drop);
      draggableObjects.on("touchmove", touchMove);
  
      dropPoints.on("dragover", dragOver);
      dropPoints.on("drop", drop);
    });


    const resetGame = () => {
      // Вернуть все элементы на исходные позиции
      // Очистить результаты
      // Скрыть сообщение о победе
      // Сбросить любые другие параметры игры
      count = 0;
      result.text("");
      $('.dropped').removeClass('dropped');
      $('.draggable-image').removeClass('hide');
      $('.draggable-image').attr('draggable', true);
    };
    
  });
  

  
  
