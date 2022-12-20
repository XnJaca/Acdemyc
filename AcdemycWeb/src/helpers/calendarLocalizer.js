
import {  dateFnsLocalizer } from 'react-big-calendar';
import esES from 'date-fns/locale/es'
import { getDay, startOfWeek, parse, format } from 'date-fns'



const locales = {
    'es': esES,
} 

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})
