window.onload = function(){
	var editor, 
		statsCharsCount, 
		statsWordsCount, 
		saveBtn, 
		saveDate, 
		$tooltip,
		autosaveInterval = null,
		resetBtn,
		fullscreenBtn,
		changeFontSizeBtns,
		i,
		changeFontSizeBtnsLength,
		onFontSizeBtnClick;

	function formatDate(date){
		var dateFormatted = 'day.month.year hours:minutes';

		dateFormatted = dateFormatted.replace('day', date.getDate());
		dateFormatted = dateFormatted.replace('month', (date.getMonth()+1) );
		dateFormatted = dateFormatted.replace('year', date.getFullYear());
		dateFormatted = dateFormatted.replace('hours', date.getHours());
		dateFormatted = dateFormatted.replace('minutes', date.getMinutes());

		return dateFormatted;
	}

	function loadFromStorage(){
		var dateString, dateObject, dateFormatted;

		if (typeof(Storage) !== 'undefined') {
			editor.value = localStorage.getItem('editor-text');

			dateString = localStorage.getItem('save-date');

			if (null !== dateString) {
				dateObject = new Date(dateString);
				dateFormatted = formatDate(dateObject);

				saveDate.innerHTML = dateFormatted;
			}

			updateStatistics();
		}
	}

	function updateStatistics(){
		var editorText, 
			textLength, 
			textParts, 
			wordsCount,
			i,
			textPartsCount;

		editorText = editor.value;
		textLength = editorText.length;

		textParts = editorText.split(' ');
		wordsCount = 0;

		for(i=0, textPartsCount=textParts.length; i<textPartsCount; i++) {
			if (textParts[i].length > 0) {
				wordsCount++;
			}
		}

		statsCharsCount.innerHTML = textLength;
		statsWordsCount.innerHTML = wordsCount;
	}

	function saveProgress(){
		if (typeof(Storage) == 'undefined') {
			// nie wspiera zapisywania
			return;
		}

		var currentDate = new Date();
		var dateFormatted = formatDate(currentDate);

		saveDate.innerHTML = dateFormatted;

		localStorage.setItem('save-date', currentDate);
		localStorage.setItem('editor-text', editor.value);

		$tooltip.tooltip('show');

		setTimeout(function(){
			$tooltip.tooltip('hide');
		}, 3000);
	}

	function startAutosave(){
		if (null === autosaveInterval) {
			autosaveInterval = setInterval(function(){
				saveProgress();
			}, 5*1000);
		}
	}

	function stopAutosave(){
		if (null !== autosaveInterval) {
			clearInterval(autosaveInterval);
			autosaveInterval = null;
		}
	}

	editor = document.querySelector('#editor');
	statsCharsCount = document.querySelector('#stats-chars-count');
	statsWordsCount = document.querySelector('#stats-words-count');
	saveBtn = document.querySelector('#save-btn');
	saveDate = document.querySelector('#save-date');
	$tooltip = $('[data-toggle="tooltip"]');
	resetBtn = document.querySelector('#reset-btn');
	fullscreenBtn = document.querySelector('#fullscreen-btn');
	changeFontSizeBtns = document.querySelectorAll('.js--change-font-size');

	saveBtn.onclick = function(){
		saveProgress();
	};

	editor.onkeyup = function(){
		updateStatistics();
	};

	editor.onfocus = function (){
		startAutosave();
	};

	editor.onblur = function(){
		stopAutosave();
		saveProgress();
	};

	resetBtn.onclick = function(){

		var message, confirmation;

		message = 'Czy na pewno chcesz zacząć od nowa?';

		confirmation = confirm(message);

		if(confirmation) {
			editor.value = '';
			updateStatistics();

			localStorage.removeItem('save-date');
			localStorage.removeItem('editor-text');

			saveDate.innerHTML = '-';
		}
	};

	fullscreenBtn.onclick = function(){
		if (screenfull.enabled) {
			screenfull.toggle();
			
		}
	};

	screenfull.on('change', function() {
		if (screenfull.isFullscreen) {
			fullscreenBtn.innerHTML = 'Wyłącz tryb pełnoekranowy';
		} else {
			fullscreenBtn.innerHTML = 'Włącz tryb pełnoekranowy';
		}
	});

	changeFontSizeBtnsLength = changeFontSizeBtns.length;
	onFontSizeBtnClick = function() {
		var currentFontSize = parseInt(editor.style.fontSize);
		var change = parseInt(this.getAttribute('data-change'));
		var newFontSize = currentFontSize + change;

		if (newFontSize > 0) {
			editor.style.fontSize = newFontSize + 'px';
		}
	};

	for(i=0; i<changeFontSizeBtnsLength; i++) {
		changeFontSizeBtns[i].onclick = onFontSizeBtnClick;
	}


	loadFromStorage();
}






