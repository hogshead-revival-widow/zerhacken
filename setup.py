#!/usr/bin/env python3

from setuptools import setup, find_packages

with open('requirements.txt', 'r') as f:
    install_requires = f.read().splitlines()

setup(
    name='zerhacken',
    version='0.0.9',
    description='Frontend und API zu stille_splitten',
    packages=find_packages(),
    python_requires='>=3.6.8',
    classifiers=['Development Status :: 3 - Alpha',
                 'Programming Language :: Python', 'Programming Language :: Python :: 3',
                 'Topic :: Multimedia :: Sound/Audio', 'Topic :: Multimedia :: Sound/Audio :: Analysis',
                 'Topic :: Utilities'],
    install_requires=install_requires
)
