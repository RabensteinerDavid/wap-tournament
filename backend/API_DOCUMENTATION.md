
# API Documentation

This document provides detailed explanations of the API endpoints and how to interact with them.
The API follows he schema: host:port/api/v1/...

## Authentication Routes

### Register

Route: POST localhost:3000/api/v1/register<br>
Request<br>
```
{
    "username": "ExampleUsername",
    "email": "example.username@gmx.at",
    "password": "123Spiegelei"
}
```

Response<br>
```
{
    "message": "User registered successfully"
}
```

Possible Errors<br>
```
{
    "error": "Email already exists"
}
```
```
{
    "error": "Username already exists"
}
```
No headers needed

### Login

Route: POST localhost:3000/api/v1/login<br>
Request<br>
```
{
    "email": "example.username@gmx.at",
    "password": "123Spiegelei"
}
```

Response<br>
```
{
    "token": "API_ACCESS_TOKEN"
}
```

Possible Errors<br>
```
{
    "error": "Invalid credentials"
}
```

No headers needed

### Get User


Route: GET localhost:3000/api/v1/user<br>
Request: No request JSON needed

Response<br>
```
{
    "username": "ExampleUsername",
    "email": "example.username@gmx.at",
	"id": "123456"
}
```

Possible Errors<br>
```
{
    "error": "Unauthorized"
}
```

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
<br>

## WTP Routes

### Get Tournaments

Route: GET localhost:3000/api/v1/tournaments<br>
Request: No request body needed<br>
Response: Array of Tournaments -> Like the response in create tournament<br>
Possible Errors<br>

### Get Tournaments

Route: GET localhost:3000/api/v1/tournament/ID<br>
Instead of ID, use the Object id string from the tournament
Request: No request body needed<br>
Response: One tournament -> Like the response in create tournament<br>
Possible Errors<br>
```
{
    "error": "Tournament not found"
}
```

### Delete Tournament
Route: DELETE localhost:3000/api/v1/tournament/ID<br>
Instead of ID, use the Object id string from the tournament<br>
You can only delete your own tournaments<br>
Request: No request body needed<br>
Response: One tournament -> Like the response in create tournament<br>
```
{
    "acknowledged": true,
    "deletedCount": 1
}
```
Possible Errors<br>
```
{
    "error": "Forbidden"
}
```
```
{
    "error": "Tournament not found"
}
```
```
{
    "error": "User not found"
}
```

### Create Tournament

Route: POST localhost:3000/api/v1/tournament<br> 
Request<br>

```
{
"title":  "Das ist ein Wettbewerb",
"participants":  ["TeamA",  "B",  "C",  "D",  "E",  "F",  "G",  "TeamH"],
"date": "2024-11-06T00:00:00Z"
}
```

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
<br>
Response<br>

```
{
	"title":  "Das ist ein Wettbewerb",
	"groups":  [
		{
			"participants":  ["Dominik","Anna","Jonathan","Stefan"],
			"results":  [0,0,0,0]
		},
		{
			"participants":  ["David","Johannes","Maria","Florian"],
			"results":  [0,0,0,0]
		}
	],
	"brackets":  [
		{
			"id":  1731013004210,
			"nextMatchId":  null,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013003903,
			"nextMatchId":  1731013004210,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013004277,
			"nextMatchId":  1731013004210,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013003613,
			"nextMatchId":  1731013003903,
			"startTime":  "2021-05-30",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013003629,
			"nextMatchId":  1731013003903,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013004179,
			"nextMatchId":  1731013004277,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		},
		{
			"id":  1731013003480,
			"nextMatchId":  1731013004277,
			"startTime":  "2024-11-06T00:00:00.000Z",
			"state":  "SCHEDULED",
			"participants":  []
		}
	],
	"isGroupPhaseDone":  false,
	"date":  "2024-11-06T00:00:00.000Z",
	"participants":  ["Dominik","David","Anna","Johannes","Jonathan","Maria","Stefan","Florian"],
	"winner":  null,
	"userId":  "672ce03ea626411d5dc602ac",
	"_id":  "672d298bbd98ed02b420015d"
}
```


### Edit/Update Tournament

Route: PUT localhost:3000/api/v1/tournament/:id<br> 
Request<br>

```
{
"title":  "Das ist ein Wettbewerb",
"participants":  ["TeamA",  "B",  "C",  "D",  "E",  "F",  "G",  "TeamH"],
"date": "2024-11-06T00:00:00Z"
}
```
Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>id</td> <td>Tournament ID </td>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</tr>
</table>
Response: Wie bei CREATE TOURNAMENT<br>

### Add point to group member (participant in group phase)

Route: PATCH localhost:3000/api/v1/tournament/:id/addpoints/:groupIndex/:memberIndex<br> 
Request<br>

```
{
    "points": 4
}
```
Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>id</td> <td>Tournament ID </td>
</tr>
<tr>
<td>groupIndex</td> <td>Index of group in tournament (Array index)</td>
</tr>
<tr>
<td>memberIndex</td> <td>Index of participant in group (Array index)</td>
</tr>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
Response:<br>

```
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

### Finish group phase (go to ko phase)

Route: PATCH localhost:3000/api/v1/tournament/:id/finishgroup<br> 
Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>id</td> <td>Tournament ID </td>
</tr>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
Response:<br>

```
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

### Return to group phase

Route: PATCH localhost:3000/api/v1/tournament/:id/returntogroup<br> 
Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>id</td> <td>Tournament ID </td>
</tr>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
Response:<br>

```
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

### Set winner of bracket

This request will only work, when none of the participants are already participants of the ascending bracket. If none of them are, this opartion will set the winner of the bracket and set the result points of the bracket

Route: PATCH localhost:3000/api/v1/tournament/:id/bracket/:bracketId/winner/:participantId<br> 

Request<br>

```
{
    "pointsWinner": 4,
    "pointsLoser": 3
}
```

Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>id</td> <td>Tournament ID </td>
</tr>
<tr>
<td>bracketId</td> <td>Bracket ID </td>
</tr>
<tr>
<td>participantId</td> <td>Participant ID </td>
</tr>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
Response:<br>

```
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

Possible Errors: <br>
```
{
    "error": "Bracket already has a winner"
}
```
```
{
    "error": "Participant not found"
}
```
The bracket does not contain two participants (TBA situation)
```
{
    "error": "Bracket not ready for match"
}
```
```
{
    "error": "Bracket not found"
}
```
```
{
    "error": "Tournament still in group phase"
}
```

### Reset winner of bracket

This opertation will reset all winners of a bracket. Because there is only one winner of a bracket, this means, that this operation removes the winner of the bracket.<br>
This will only work, when the ascending bracket is either the finale or the ascending bracket of the ascending bracket does not contain the winner of the referenced bracket. This is because, in that case recusrive deletion is prevented, so the frontend can have a saver way of dealing with incorrect inputs. Therefore a few error messages are possible, which will be elaborated further down below.

Route: PATCH localhost:3000/api/v1/tournament/:id/bracket/:bracketId/resetwinners<br> 
Request Parameter<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<tr>
<td>id</td> <td>Tournament ID </td>
</tr>
<tr>
<td>bracketId</td> <td>Bracket ID </td>
</tr>
<tr>
<td>participantId</td> <td>Participant ID </td>
</tr>
</table>

Headers<br>
<table> 
<tr> 
<th>Name</th> <th>Value</th>
</tr> 
<tr> 
<td>Authorization</td> <td>API_ACCESS_TOKEN </td>
</table>
Response:<br>

```
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

Possible Errors:<br>
```
{
    "error": "User not found"
}
```
```
{
    "error": "Tournament still in group phase"
}
```
```
{
    "error": "Bracket not found"
}
```
The bracket does not contain two participants (TBA situation)
```
{
    "error": "Bracket not ready for match"
}
```
```
{
    "error": "The winner is already in the ascending bracket of the ascending bracket. Unable to reset!"
}
```
```
{
    "error": "Tournament not found"
}
```
```
{
    "error": "Forbitten"
}
```
```
{
    "error": "Internal server error"
}
```