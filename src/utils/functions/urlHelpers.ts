/**
 * Function that takes in the youtube video url of the below formats
 * and returns the video ID from it
 *
 * URL Formats supported:
 * - http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
 * - http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
 * - http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
 * - http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
 * - http://www.youtube.com/embed/0zM3nApSvMg?rel=0
 * - http://www.youtube.com/watch?v=0zM3nApSvMg
 * - http://youtu.be/0zM3nApSvMg
 *
 * @param url : Youtube video URL
 * @returns Youtube video ID OR empty string
 */
export function youtube_parser(url: string) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : "";
}
