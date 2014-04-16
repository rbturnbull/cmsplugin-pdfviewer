from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool

from .models import PDFViewer


class PDFViewerPlugin(CMSPluginBase):
    model = PDFViewer
    name = _('PDF viewer')
    render_template = 'cmsplugin_pdfviewer/plugin.html'
    text_enabled = True

    def render(self, context, instance, placeholder):
        context.update({
            'object': instance,
            'placeholder': placeholder
        })
        return context

plugin_pool.register_plugin(PDFViewerPlugin)
