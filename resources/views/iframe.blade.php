{!! $body !!}

<script>
    window.onload = function () {
        var body = document.body,
                html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);

        var ng;
        if (ng = window.parent.angular) {
            ng.element('#msg-iframe').attr('height', height + 'px');
        }

        var links = document.querySelectorAll('a[href^=http]');

        for (var i in links) {
            var link = links[i];
            link.onclick = function () {
                if (confirm('{{ trans('gmail.open_external_url') }}')) {
                    window.parent.location = this.href;
                }
                return false;
            }
        }
    }
</script>