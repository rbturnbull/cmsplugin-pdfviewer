from setuptools import setup, find_packages

version = '1.0'

setup(
    name='cmsplugin-pdfviewer',
    version=version,
    description='PDF viewer plugin for Django-CMS',
    author='Naeka',
    author_email='contact@naeka.fr',
    url='https://github.com/naeka/cmsplugin-pdfviewer',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
    ],
)
