function getURLParameters()
{
    var pageURL = window.location.search.substring(1);
    var URLVariables = pageURL.split('&');
    var parameters = {};
    for (var i = 0; i < URLVariables.length; i++) 
    {
        let keyValue = URLVariables[i].split('=');
        parameters[keyValue[0]]=keyValue[1];
    }
    return parameters;
}