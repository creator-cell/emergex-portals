import { snow, pipe, fire } from "@/assets/icons";

// Define colors based on the level
const levelColors: { [key: number]: string } = {
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
};
interface TabIconColor {
    icon: string;
    color: string;
}

export const tabsIconColor: { [key: string]: TabIconColor } = {
    'Level 1': {
        icon: snow,
        color: "linear-gradient(96.65deg, #FF5755 0%, #FBADAD 97.03%)"
    },
    'Level 2': {
        icon: fire,
        color: "linear-gradient(96.65deg, #F3BD50 0%, #FBE1AD 97.03%)"
    },
    'Level 3': {
        icon: pipe,
        color: "linear-gradient(96.65deg, #5EE865 0%, #BAFBC9 97.03%)"
    }
}


export const tabsData = [
    {
        "taskIcon": "fire",
        "taskId": "FIRMD-273UY",
        "taskHead": "Fire on the room",
        "timer": "23:05:283",
        "level": 2
    },
    {
        "taskIcon": "snow",
        "taskId": "FIRMD-273UY",
        "taskHead": "Heavy Snow fall",
        "timer": "23:05:283",
        "level": 1
    },
    {
        "taskIcon": "pipe",
        "taskId": "FIRMD-273UY",
        "taskHead": "Heavy snow fall",
        "timer": "23:05:283",
        "level": 3
    },
    {
        "taskIcon": "fire",
        "taskId": "FIRMD-273UY",
        "taskHead": "Fire on the room",
        "timer": "23:05:283",
        "level": 2
    },
    {
        "taskIcon": "fire",
        "taskId": "FIRMD-273UY",
        "taskHead": "Fire on the room",
        "timer": "23:05:283",
        "level": 2
    }
]
