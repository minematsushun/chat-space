json.content @message.content
json.image @message.image.url
json.user @message.user.name
json.created_at @message.created_at.to_s
json.id @message.id