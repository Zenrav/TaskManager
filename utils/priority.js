export const calculatePriority = (task) =>{
    let score = 0;
    const now = new Date();
    if(task.deadline){
        const diff = new Date(task.deadline) - now;
        const days = diff/(1000 * 60 * 60 * 24);

        if(days<1) score += 50;
        else if(days<3) score += 30;
        else score += 10;
    }
    if (task.importance === 'high') score += 30;
    else if(task.importance === 'medium') score += 20;
    else score += 10;

    if (task.createdAt){
        const age = now - new Date(task.createdAt);
        const days = age/(1000 * 60 * 60 * 24);

        if(days>3) score += 20;
    }
    return score;
}