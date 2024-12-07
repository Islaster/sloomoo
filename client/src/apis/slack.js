import axios from "axios";

export function slack(searchText){
    axios.post('https://7ac4-2603-8000-a9f0-6cb0-508a-27a4-7718-7141.ngrok-free.app/slack/message', {searchText})
}