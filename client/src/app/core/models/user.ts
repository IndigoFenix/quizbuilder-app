export interface User {
    'id':string
    'name':string
    'admin':boolean
    'token':string | undefined
    'tokenExpires':string | undefined
}