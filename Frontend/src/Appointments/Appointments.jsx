import Calendar from "./Calendar";
import Scheduler from "./Scheduler";

function Appointments() {
    return (
        <div style={{display:'flex', flexDirection: 'row'}}>
            <Calendar />
            <Scheduler />
        </div>
    )
}

export default Appointments;
