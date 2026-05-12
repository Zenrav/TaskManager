import fs from 'fs';
import path from 'path';

export const getDeadlineEmail = (task) =>{
    try{
        const templatePath = path.join(process.cwd(), 'templates', 'email.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        const finalHTML = htmlContent
                        .replaceAll('{{name}}', task.assignedTo.name || 'User')
                        .replaceAll('{{title}}', task.title)
                        .replaceAll('{{deadline}}', new Date(task.deadline).toDateString());
        
        return finalHTML;
    }catch(error){
        console.error('Failed to load email template: ', error);
        return`<p>Reminder: Your task "${task.title} is due on ${task.deadline}</p>`
    }
}