import dayjs from "dayjs";

export function calculateDeliveryDays(deliveryDays){
    let daysRemaining=deliveryDays;
    let deliveryDate=dayjs();
    while(daysRemaining>0){
        deliveryDate=deliveryDate.add(1,'day');
        const dayOfWeek=deliveryDate.day();
        if(dayOfWeek!==0 && dayOfWeek!==6){
            daysRemaining--;
        }
    }
    return deliveryDate.format('YYYY-MM-DD HH:mm:ss');
}