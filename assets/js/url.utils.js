
/**
 * Expecting the URL to have the following format:
 *
 * https://slashtmp.io/view?f=[UUID]
 *   &AWSAccessKeyId=[ALPHANUMERIC]
 *   &Expires=[EXPIRY for GET requests]&Signature=[SIGNATURE for GET requests]
 *   &Expires=[EXPIRY for HEAD requests]&Sisgnature=[SIGNATURE for HEAD requests]
 *
 * Will convert the URL to the following format:
 *
 * https://slashtmp.io/view?f=[UUID]
 *   &a=[ALPHANUMERIC]
 *   &e=[EXPIRY for GET requests]
 *   &s=[SIGNATURE for GET requests]
 *   &e=[EXPIRY for HEAD requests]&s=[SIGNATURE for HEAD requests]
 */
function simplify(url) {
  return url
    .replace(/AWSAccessKeyId/, 'a')
    .replace(/Expires/g, 'e')
    .replace(/Signature/g, 's');
}

/**
 * Takes the output of the simplify() function and convert it back to AWS URL format.
 */
function awsify(url) {
  return url
    .replace(/&a=/, '?AWSAccessKeyId=')
    .replace(/&e=/g, '&Expires=')
    .replace(/&s=/g, '&Signature=');
}

/**
 * Takes a URL in awsified format and strip out the last two parameters,
 * which correspond to Expires and Signature for HEAD requests to S3.
 */
function s3Get(url) {
  var params = url.split('&');
  params.pop(); // signature for HEAD requests
  params.pop(); // expiry for HEAD requests
  return params.join('&');
}

/**
 * Take a URL in either a simplified or awsified format and strip out the first two parameters,
 * which correspond to Expires and Signature for GET requests to S3.
 */
function s3Head(url) {
  var params = url.split('&');
  var signature = params.pop(); // signature for HEAD requests
  var expiry = params.pop(); // expiry for HEAD requests

  // remove the expiry and signature for GET requests as we don't want it when doing
  // a HEAD request
  params.pop(); // signature for GET request
  params.pop(); // expiry for GET request

  // re-add the expiry and signature for HEAD requests back to the path
  params.push(expiry);
  params.push(signature);

  return params.join('&');
}
