// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { NextResponse } from 'next/server';
// import https from 'https';

// // Cookie jar to maintain session
// let sessionCookies = '';

// export async function GET() {
//   const forumUrl = 'https://forums.mangadex.org/whats-new/latest-activity';
//   const maxComments = 10;

//   try {
//     // Create axios instance with comprehensive configuration
//     const axiosInstance = axios.create({
//       httpsAgent: new https.Agent({  
//         rejectUnauthorized: false,
//         keepAlive: true,
//         keepAliveMsecs: 1000,
//         maxSockets: 5,
//         timeout: 30000,
//       }),
//       timeout: 30000,
//       maxRedirects: 10,
//       validateStatus: (status) => status < 400, // Accept redirects
//     });

//     // Comprehensive headers that exactly match a real browser request
//     const baseHeaders = {
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//       'Accept-Encoding': 'gzip, deflate, br, zstd',
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Cache-Control': 'max-age=0',
//       'Connection': 'keep-alive',
//       'DNT': '1',
//       'Host': 'forums.mangadx.org',
//       'Referer': 'https://forums.mangadx.org/',
//       'Sec-Fetch-Dest': 'document',
//       'Sec-Fetch-Mode': 'navigate',
//       'Sec-Fetch-Site': 'same-origin',
//       'Sec-Fetch-User': '?1',
//       'Upgrade-Insecure-Requests': '1',
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
//       'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
//       'sec-ch-ua-mobile': '?0',
//       'sec-ch-ua-platform': '"Windows"',
//     };

//     console.log('Step 1: Establishing session with main page...');
    
//     // Step 1: Visit main page to establish session and get cookies
//     try {
//       const mainPageResponse = await axiosInstance.get('https://forums.mangadx.org/', {
//         headers: {
//           ...baseHeaders,
//           'Sec-Fetch-Site': 'none', // First visit
//           'Referer': undefined, // No referer for first visit
//         }
//       });

//       // Extract cookies from response
//       const setCookieHeaders = mainPageResponse.headers['set-cookie'];
//       console.log(mainPageResponse)
//       if (setCookieHeaders) {
//         sessionCookies = setCookieHeaders
//           .map(cookie => cookie.split(';')[0])
//           .join('; ');
//         console.log('Session cookies established:', sessionCookies.substring(0, 100) + '...');
//       }
//     } catch (mainPageError) {
//       console.log('Main page visit failed, continuing without session:', mainPageError.message);
//     }

//     // Step 2: Wait to mimic human behavior
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     console.log('Step 2: Fetching target page...');
    
//     // Step 3: Now fetch the actual target page with session
//     const targetHeaders = {
//       ...baseHeaders,
//       ...(sessionCookies && { 'Cookie': sessionCookies }),
//     };

//     const response = await axiosInstance.get(forumUrl, {
//       headers: targetHeaders
//     });
// console.log(response)
//     if (response.status !== 200) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     console.log('Successfully fetched forum page, parsing content...');
//     const $ = cheerio.load(response.data);
//     const comments: any[] = [];

//     // Debug: Log page structure
//     console.log('Page title:', $('title').text());
//     console.log('Block rows found:', $('.block-row').length);
    
//     // If no block-rows found, try alternative selectors
//     let activityElements = $('.block-row');
//     if (activityElements.length === 0) {
//       console.log('No .block-row found, trying alternative selectors...');
//       activityElements = $('.structItem, .node-row, .activity-item, [data-user-id]');
//       console.log('Alternative elements found:', activityElements.length);
//     }

//     // Parse activity elements
//     activityElements.each((index: number, element: any) => {
//       if (comments.length >= maxComments) return false;

//       try {
//         const $element = $(element);
        
//         // Multiple strategies for username extraction
//         let username = '';
//         const usernameSelectors = [
//           '.username',
//           '[data-user-id]',
//           'a[href*="/members/"]',
//           '.structItem-title a',
//           '.node-title a',
//           '.contentRow-title a[href*="/members/"]'
//         ];
        
//         for (const selector of usernameSelectors) {
//           username = $element.find(selector).first().text().trim();
//           if (username) break;
//         }
        
//         if (!username) {
//           console.log(`Row ${index}: No username found, skipping`);
//           return;
//         }

//         // Extract avatar
//         let avatarUrl = null;
//         const avatarSelectors = ['.avatar img', '.structItem-iconContainer img', '.node-icon img'];
//         for (const selector of avatarSelectors) {
//           const src = $element.find(selector).attr('src');
//           if (src) {
//             avatarUrl = src.startsWith('/') ? `https://forums.mangadx.org${src}` : src;
//             break;
//           }
//         }

//         // Extract activity title/content
//         let activityTitle = '';
//         const titleSelectors = [
//           '.contentRow-title',
//           '.structItem-title', 
//           '.node-title',
//           '.activity-title'
//         ];
        
//         for (const selector of titleSelectors) {
//           activityTitle = $element.find(selector).text().trim();
//           if (activityTitle) break;
//         }

//         // Extract manga/thread title
//         let mangaTitle = '';
//         const threadLink = $element.find('a[href*="/threads/"]').last();
//         if (threadLink.length) {
//           mangaTitle = threadLink.text().trim();
//         }

//         // Extract comment content
//         const contentSelectors = ['.contentRow-snippet', '.structItem-snippet', '.node-snippet'];
//         let commentContent = '';
//         for (const selector of contentSelectors) {
//           commentContent = $element.find(selector).text().trim();
//           if (commentContent) break;
//         }

//         // Extract timestamp
//         let timeAgo = '';
//         const timeSelectors = ['time', '.u-dt', '.structItem-date'];
//         for (const selector of timeSelectors) {
//           const timeEl = $element.find(selector);
//           timeAgo = timeEl.text().trim() || timeEl.attr('title') || timeEl.attr('datetime') || '';
//           if (timeAgo) break;
//         }

//         // Determine reaction type
//         let reactionType = 'Comment';
//         const activityLower = activityTitle.toLowerCase();
//         if (activityLower.includes('reacted') || activityLower.includes('liked')) {
//           reactionType = 'Like';
//         } else if (activityLower.includes('replied')) {
//           reactionType = 'Reply';
//         } else if (activityLower.includes('posted') || activityLower.includes('created')) {
//           reactionType = 'New Thread';
//         }

//         // Extract thread URL
//         let threadUrl = '';
//         const threadLinkEl = $element.find('a[href*="/threads/"]').first();
//         if (threadLinkEl.length) {
//           threadUrl = threadLinkEl.attr('href') || '';
//           if (threadUrl.startsWith('/')) {
//             threadUrl = `https://forums.mangadx.org${threadUrl}`;
//           }
//         }

//         // Add comment if we have essential data
//         if (username && (mangaTitle || activityTitle)) {
//           comments.push({
//             id: `activity_${Date.now()}_${index}`,
//             username,
//             avatarUrl,
//             mangaTitle: mangaTitle || extractTitleFromActivity(activityTitle),
//             reactionType,
//             commentContent,
//             timeAgo,
//             threadUrl,
//             activityType: determineActivityType(activityTitle),
//             rawActivity: activityTitle,
//             debug: {
//               elementHtml: $element.html()?.substring(0, 200) + '...',
//               selectors: {
//                 username: usernameSelectors.find(s => $element.find(s).length > 0),
//                 title: titleSelectors.find(s => $element.find(s).length > 0)
//               }
//             }
//           });
          
//           console.log(`Parsed comment ${comments.length}: ${username} - ${mangaTitle || activityTitle}`);
//         }
//       } catch (elementError) {
//         console.error(`Error processing element ${index}:`, elementError);
//       }
//     });

//     console.log(`Successfully parsed ${comments.length} comments from ${activityElements.length} elements`);

//     // If no comments found, provide debug info
//     if (comments.length === 0) {
//       console.log('DEBUG: Page content sample:', response.data.substring(0, 1000));
//       console.log('DEBUG: All potential elements:', $('div[class*="row"], div[class*="item"], div[class*="activity"]').length);
//     }

//     return NextResponse.json({
//       data: comments,
//       total: comments.length,
//       timestamp: new Date().toISOString(),
//       source: 'MangaDX Forums Latest Activity - Live Data',
//       debug: {
//         pageSize: response.data.length,
//         pageTitle: $('title').text(),
//         elementsFound: activityElements.length,
//         hasCookies: !!sessionCookies,
//         responseHeaders: Object.keys(response.headers)
//       }
//     });

//   } catch (error: any) {
//     console.error('Scraping failed:', error.message);
//     console.error('Error details:', {
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       url: error.config?.url,
//       method: error.config?.method,
//       responseData: error.response?.data?.substring(0, 500)
//     });
    
//     return NextResponse.json({
//       error: `Scraping failed: ${error.message}`,
//       errorDetails: {
//         status: error.response?.status || 'unknown',
//         statusText: error.response?.statusText || 'unknown',
//         type: error.code || error.name || 'unknown',
//         url: error.config?.url
//       },
//       data: [],
//       total: 0,
//       timestamp: new Date().toISOString(),
//       troubleshooting: {
//         step1: 'Check if the URL is accessible',
//         step2: 'Verify the site structure hasn\'t changed',
//         step3: 'Consider implementing CAPTCHA handling',
//         step4: 'Try using a residential proxy'
//       }
//     }, { status: 500 });
//   }
// }

// // Helper functions remain the same
// function extractTitleFromActivity(activityText: string): string {
//   let title = activityText
//     .replace(/^.*?(reacted to|replied to|posted the thread|created)\s+/i, '')
//     .replace(/\s+with.*$/, '')
//     .replace(/\s+in the.*$/, '')
//     .trim();
  
//   if (!title || title.length < 3) {
//     const patterns = [
//       /thread\s+"([^"]+)"/,
//       /in\s+(.+?)(?:\s+with|\s*$)/,
//       /"([^"]+)"/,
//       /topic\s+(.+?)(?:\s+with|\s*$)/
//     ];
    
//     for (const pattern of patterns) {
//       const match = activityText.match(pattern);
//       if (match && match[1]) {
//         title = match[1].trim();
//         break;
//       }
//     }
//   }
  
//   return title || 'Unknown Thread';
// }

// function determineActivityType(activityText: string): string {
//   const lower = activityText.toLowerCase();
//   const patterns = [
//     { pattern: /reacted|liked/, type: 'reaction' },
//     { pattern: /replied|responded/, type: 'reply' },
//     { pattern: /posted|created|started/, type: 'new_thread' },
//     { pattern: /watching|following/, type: 'watch' },
//     { pattern: /commented/, type: 'comment' }
//   ];
  
//   for (const { pattern, type } of patterns) {
//     if (pattern.test(lower)) return type;
//   }
  
//   return 'unknown';
// }