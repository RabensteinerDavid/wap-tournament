
# API Documentation

This document provides detailed explanations of the API endpoints and how to interact with them.
The API follows he schema: host:port/api/v1/...

## Authentication Routes

### Register

Route: POST localhost:3000/api/v1/register<br>
Request<br>
```
{
    "username": "DummNeuge",
    "email": "d.neugebauer@gmx.at",
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
    "email": "d.neugebauer@gmx.at",
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
    "username": "DummNeuge",
    "email": "d.neugebauer@gmx.at"
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