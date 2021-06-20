### :exclamation: :exclamation: Note
There are *2* repositories for this project.
The one you are currently looking at stores the source code of the web app.

For the documentations, notes, prototypes code and team resources, please go to:

**https://gitlab.doc.gold.ac.uk/softproj20/Gardening-Webapp**


----


**Documentation**

----

[[_TOC_]]


## Basic Structure
- This web app uses **MEN** Structure: **M**ongo, **E**xpress, **N**ode.js, without any front-end JS Framework.



## Folder Structure

### Explanation of folders
- **build**: This is the folder where Webpack will export to. Contains packed and uglified files send to the end users.

- **src**: Source code, before packing up.
- **test**: Code test files `(npm test)`
- **public**: Static files can be accessed by the end users
- **middlewares**: Express middwares, such as validator, redirect, etc
- **models**: Mongo pre-defined Schema files, contains all the database collections' blueprints.
- **views**: .ejs files, there is no static html file in this app.
- **index.js**: The entry point of the app
- **webpack.config.js**: Master Webpack configuration file 



## What each page does (Features)
### Index Page
- Has an intro section to the app, only if NOT logged in
- :seedling: Has notification icon, next to the Calendar Tab, ONLY IF logged in.

### Draw Page
- Drag and drop models onto the canvas

### Search Page
- Shows a link to 'add to database page', only after clicking the 'search button'
- Can search plants based on plant's name, **case-insensitive and free-match**
- Can click image in search result, then add to own collection

### Calendar Page
- Can drag-drop to change dates.
- :cop: If logged in as admin, will show all the available plants' seeding/flowering dates
- :cop:  Admin account is NOT being used to track admin's agenda, the dates on admin's calendar is to set up the default suggested seeding/flowering dates for newly registered end-users.
- :cop: If logged in as admin, delete/modify any seeding/flowering dates, **will effect everyone else's** calendar, **ONLY IF** the end user **did not/has not** chosen own dates for seeding/flowering
- :cop: as admin, you can NOT see other people's events, including their flowering/seeding events. 
- :cop: logged in as admin, you can add your own non-flowering/seeding events, end users cannot see.
- :boy: if logged in as an user(any username rather than the name 'admin'), you can see default suggested seeding/flowering dates for a plant, **ONLY IF you added that plant to your collection**.
- :boy: if logged in as an user, you can modify the seeding/flowering dates, this **will not** affect other users, and **will not** affect the admin's calendar
- :boy: Each user's calendar **will not** interference with each other

### Database Page
- Click Image to add to collection
- Click 'add' button to add to database
- :cop: if admin, the newly added plants will show on the page **immediately**
- :boy: if NOT admin, the newly added plants **will NOT be shown**, until verified by admin. (Can be done in the admin's profile page, by using checkbox.)
- Only a plant name is required, when adding plants to database, other fields are all optional
- When add plants to database, default dates are all **TODAY**, default image is from Flickr API, default description is from Merriam-Webster API 
- Does not allow duplicate plant name

### User Profile Page
- **Each user** has a profile page
- Click user name on the top-right corner to go to
- User Avatar image is generated automatically, using an API from a  'image placeholder provider'

### Login/Signup/Reset Password Page
- Does not allow duplicate name/email
- There are **reserved usernames**(not allowed on end users) , such as 'admin', 'anonymous', 'administrator' (in the file '~/middlewares/reservedKeywords.js')
- [Reset password](http://doc.gold.ac.uk/usr/520/users/reset) method is **not secure**, only for demonstration
- Sign up page has a **video background**, wait few seconds
- Login Page has a background image API

### 400, 500 Page
- There is a 404, 500 and 503 page




## Other Features
- Can **block user's IP**, if tries to CSRF, or bypass/tamper client-side ejs, JS code
- Has barriers against **CSRF** attack, traffic from outside of the app will be blocked. `npm csrf`
- Has basic setup to ensure HTTP **Header secure**, `npm helmet`
- Can **log** each request, `npm logger`
- Can **compress** response. `npm connectAssets,compression`
- Stores **cookies inside database**, more secure. `npm connect-mongodb-session`
- Has input **sanitizer**, validator
- Has DB validator `npm @hapi/Joi`, `~middlewares/schemaValidator.js`
- Has **validator** for color format (plant's color code), username, password, etc
- Has midware against **double-login**
- Has **browse-version detector** `~routes/app_masterFilter.js`
- Minimum Supported browser is **IE 10**, or equivalent
- Has our self-built re-useable functions. `all filename starts with helper_  `
- Has no API route yet
- Cookie expires in **one week** time
- Each JS file is 'use strict', and other **coding standard**
- Has **tag** in code comments, to locate lines fast
- Has regular database **backup** 
- For other features can't remember them all



## Technique/Tools used

- **Flickr** API (plant images)
- Merriam-Webster **Dictionary** API (plant descriptions)
- All the `npm` packages in index.js
- **JQuery** (js for each ejs page)
- **Three**.js (draw)
- **Pure** CSS (grid layout)
- **Materialize** CSS, JS (for all the forms, buttons)
- **Webpack** (build final compressed app)
- **dhtmlxscheduler** 
- **Dat**.GUI (draw page control panel)
- **Pexel** API, **vidbg**.css (sign up background video)
- **Unsplash** API, (login backfround img)



## Some Pseudocode for non-modular code files

Some code has not been sorted into easy-to-understand function blocks yet, Pseudocode included below:

- `~/routes/app_users.js` --> **POST /input_userPlants**: 

```javascript
/* this route updates user's own plant collection */

find(current_user) in database, then populate(userPlants_field):
	if plant is already in the database:
    	res.end
    else:
    	find the plant in plants_collection,
    	copy its data to a new Object of userPlants,
    	save the new instance of userPlants,
    	push the new instance of userPlants into (current_user-->userPlants_field),
    	save current_user,
    	res.end
```



- `~/routes/app_users.js` --> **POST /addPlants**: 

```javascript
/* this route updates database plants collection */

find(plant) in database:
	if exist already:
		res.end
	else:
		fetch data from Dictionary API:
			fetch data from Flickr API:
				store: user-passed data and API data into database
		                     res.end
```



- `~/routes/app_calendar.js` --> **GET /data**: 

```javascript
/* this route GET calendar data from the database */

if(admin):
	get all plants dates,
	get admin event dates,
	res.end
else:
	get userPlants dates,
	get user event dates,
	res.end
```



- `~/routes/app_calendar.js` --> **POST /data**: 

```javascript
/* this route updates/delete/insert data into events collection in database*/
/* originally was seperate routes, later combined into one*/

store user-passed data into variables,
store the action needs to be performed into: var action,
store the destination target into: var target,
/*--------------update---------------------*/
if(action==='updated'):
	if(target==='seed'):
		if(admin): update the plants collection directly
		else: update the userPlants collection ONLY
	if(target==='flower'):
              if(admin): update the plants collection directly
               else: update the userPlants collection ONLY
	else:
		update the events collection
	res.end

/*--------------inserte---------------------*/
if(action==='inserted'):
	insert event into events collection in database,
	res.end
	
/*--------------delete---------------------*/
if(action==='deleted'):
	if(target==='seed'):
		if(admin): delete the plant_seeding_dates ONLY
		else: delete the userPlants_seeding_dates ONLY
	if(target==='flower'):
         if(admin): delete the plant_flowering_dates ONLY
		 else: delete the userPlants_flowering_dates ONLY
		 
	else:
		delete the event directly from evens collection in database
	res.end

/*--------------non-supported actions---------------------*/
else:
	res.end('not supported action')
```

