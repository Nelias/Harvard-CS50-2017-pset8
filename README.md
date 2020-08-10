# Harvard-CS50-2017-pset8

<div>
<img src="https://static.javatpoint.com/tutorial/flask/images/flask-tutorial.png" width="70" height="70">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/533px-Google_Maps_Logo_2020.svg.png" width="70" height="70">
<img src="https://i.dlpng.com/static/png/510838_thumb.png" width="70" height="70">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Sqlite-square-icon.svg/256px-Sqlite-square-icon.svg.png" width="70" height="70">
</div>

A website with a map of current news from Poland

Done according to: https://docs.cs50.net/problems/mashup/mashup.html

## Development

1. Run `sudo apt install python-pip`
2. In the root folder run `pip install -r requirements.txt`
3. Go to https://developers.google.com/maps/documentation/javascript/get-api-key and in an `.env` file provide a Google Maps Javascript API Key via: export API_KEY=value
4. Or paste those variables to your terminal
5. Run `flask run` and app is now present on `http://localhost:5000`

## Preview

![Alt text](mashup-poland-preview-map.png?raw=true 'map of Poland')

![Alt text](mashup-poland-preview-articles.png?raw=true 'articles on map')
