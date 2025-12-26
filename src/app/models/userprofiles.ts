export interface UserProfiles{
    profiles:UserProfile[];
}
export interface UserProfile{
    id:string; // Changed from number to string for Firestore document IDs
    name:string;
    age:number;
    grade:number;
    playStyle:string;
    job:string;
    maritalStatus:string;
    about:string;
    interests:string[];
    rate:number;
    imgUrl:string;
    ownerid?: string; // Optional field for owner ID
    gender?: string;
}
export interface UserAccount{
    id:number;
    name:string;
    wallet:number;
    isActive:boolean;
    totalEarnings:number;
    avgRating:number;
    totalPlays:number;
    createdAt:string;
    chrCount:number;
}