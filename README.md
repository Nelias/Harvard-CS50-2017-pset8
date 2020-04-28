# Harvard-CS50-2017-pset8

<div>
<img src="https://lh3.googleusercontent.com/proxy/kvBTko8aXHUsuESPGIW96SxPTqCvOfnRMlqfkud_DM57wjdj9NzD5J4F_njmNtOOjviIMLFWId0cLnA6OdMmkHUa-5AMBACnmwvKNac_-UX82FZgo5DRSUPfyVw" width="70" height="70">
<img src="https://static.javatpoint.com/tutorial/flask/images/flask-tutorial.png" width="70" height="70">
<img src="https://lh3.googleusercontent.com/proxy/50jHTaU6Bo0tb6TXscOfdrCF6j3B7tkSmiFQdPDyQXDi7LsqOZsLcqUI3fVsupwZelDH0NgUmeQnseRABoRZ9Tf5qLyoPXDvuSx6" width="70" height="70">
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
