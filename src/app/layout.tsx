import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'Masar Customer Acquisition OS',description:'AI-powered customer intelligence, outreach and relationship management platform'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
