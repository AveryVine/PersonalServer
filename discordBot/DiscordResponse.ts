// class DiscordResponse {
//     private author: Object;
//     private thumbnail: Object;
//     private description: string;
//     private fields: DiscordResponseField[];
//     private footer: Object;
//     private timestamp: Date;

//     constructor(builder: DiscordResponseBuilder) {
//         this.timestamp = new Date();
//     }
// }

// class DiscordResponseBuilder {
//     author: Object;
//     thumbnail: Object;
//     description: string;
//     fields: DiscordResponseField[];
//     footer: Object;

//     constructor() {
//         this.author = {};
//         this.thumbnail = {};
//         this.description = "";
//         this.fields = [];
//         this.footer = {};
//     }

//     public withAuthor(name: string, iconUrl: string) {
//         this.author = {
//             name: name,
//             iconUrl: iconUrl
//         }
//     }

//     public withColor

//     public withThumbnail(url: string) {
//         this.thumbnail = {
//             url: url
//         }
//     }

//     public withDescription(description: string) {
//         this.description = description;
//     }

//     public withField(name: string, value: string, inline: boolean) {
//         this.fields.push(new DiscordResponseField(name, value, inline));
//     }

//     public build() {
//         return new DiscordResponse(this);
//     }
// }

// class DiscordResponseField {
//     name: string;
//     value: string;
//     inline: boolean;

//     constructor (name: string, value: string, inline: boolean) {
//         this.name = name;
//         this.value = value;
//         this.inline = inline;
//     }
// }

// export default DiscordResponse;
